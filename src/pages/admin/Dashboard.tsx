import React, { useEffect, useState, useMemo } from 'react';
import { collection, query, orderBy, onSnapshot, Timestamp, deleteDoc, doc, writeBatch } from 'firebase/firestore';
import { db, auth } from '../../firebase';
import { signOut } from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
} from 'recharts';
import { 
  Download, Filter, Search, LogOut, LayoutDashboard, Database, 
  Users, Calendar, ChevronRight, FileText, TrendingUp, AlertCircle,
  ArrowUpRight, ArrowDownRight, Clock, ArrowLeft, X, Printer, Copy, Check, Zap, BarChart3, ClipboardList, Star,
  Trash2, CheckSquare, Square
} from 'lucide-react';
import { format, startOfWeek, startOfMonth, isWithinInterval, subDays } from 'date-fns';
import { json2csv } from 'json-2-csv';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

import { 
  EXPERIENCE_OPTIONS,
  CLIENT_SURVEY_SCHEMA,
  SUPPORT_SURVEY_SCHEMA,
  FULL_SURVEY_SCHEMA
} from '../../constants';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface SurveyResponse {
  id: string;
  full_name: string;
  email: string;
  role: string;
  user_type: string;
  experience_years?: string;
  practice_type?: string;
  va_count?: string;
  submitted_at: Timestamp;
  sections: any;
  summary?: {
    biggest_challenge: string;
    top_training_needs: string[];
    preferred_training_method: string[];
  };
}

const USER_TYPE_COLORS: Record<string, string> = {
  'Virtual Assistant (Medical & Business)': '#0072B2',
  'Support Team': '#009E73'
};

const COLORS = [
  '#0072B2', // Blue
  '#009E73', // Bluish Green
  '#D55E00', // Vermillion
  '#CC79A7', // Reddish Purple
  '#E69F00', // Orange
  '#56B4E9', // Sky Blue
  '#F0E442', // Yellow
  '#000000', // Black
  '#7c3aed', // Violet
  '#db2777', // Pink
  '#0891b2', // Cyan
  '#16a34a', // Green
];

const AdminDashboard: React.FC = () => {
  const [responses, setResponses] = useState<SurveyResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [expFilter, setExpFilter] = useState('All');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedResponse, setSelectedResponse] = useState<SurveyResponse | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'responses' | 'reports' | 'survey-insights'>('overview');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [selectedResponseIds, setSelectedResponseIds] = useState<string[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{
    type: 'single' | 'selected' | 'all';
    id?: string;
  } | null>(null);
  const [reportRoleFilter, setReportRoleFilter] = useState('All');
  const [reportExpFilter, setReportExpFilter] = useState('All');
  const [reportStartDate, setReportStartDate] = useState('');
  const [reportEndDate, setReportEndDate] = useState('');
  const [reportType, setReportType] = useState<'VA' | 'Support'>('VA');
  const [analysisRole, setAnalysisRole] = useState('All');
  const navigate = useNavigate();

  useEffect(() => {
    const q = query(collection(db, 'responses'), orderBy('submitted_at', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const allData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as SurveyResponse[];
      
      setResponses(allData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching responses:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const practiceTypeChartData = useMemo(() => {
    const practiceMap = responses.reduce((acc: any, curr) => {
      const type = curr.practice_type || curr.sections?.['client-initial']?.practice_type || 'N/A';
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(practiceMap).map(([name, value]) => ({ name, value }));
  }, [responses]);

  const filteredResponses = useMemo(() => {
    return responses.filter(res => {
      const matchesSearch = res.full_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           res.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = roleFilter === 'All' || res.role === roleFilter;
      const matchesExp = expFilter === 'All' || res.experience_years === expFilter;
      
      const submittedDate = res.submitted_at.toDate();
      const matchesStartDate = !startDate || submittedDate >= new Date(startDate);
      const matchesEndDate = !endDate || submittedDate <= new Date(new Date(endDate).setHours(23, 59, 59, 999));
      
      return matchesSearch && matchesRole && matchesExp && matchesStartDate && matchesEndDate;
    });
  }, [responses, searchTerm, roleFilter, expFilter, startDate, endDate]);

  const stats = useMemo(() => {
    const now = new Date();
    const weekStart = startOfWeek(now);
    const monthStart = startOfMonth(now);

    let totalExp = 0;
    let expCount = 0;

    responses.forEach(res => {
      if (res.experience_years) {
        const match = res.experience_years.match(/(\d+)/);
        if (match) {
          totalExp += parseInt(match[1]);
          expCount++;
        }
      }
    });

    return {
      total: responses.length,
      thisWeek: responses.filter(r => r.submitted_at.toDate() >= weekStart).length,
      thisMonth: responses.filter(r => r.submitted_at.toDate() >= monthStart).length,
      avgExp: expCount > 0 ? (totalExp / expCount).toFixed(1) : '0',
      byRole: responses.reduce((acc: any, curr) => {
        const role = curr.role || 'N/A';
        acc[role] = (acc[role] || 0) + 1;
        return acc;
      }, {})
    };
  }, [responses]);

  const roleChartData = useMemo(() => {
    return Object.entries(stats.byRole).map(([name, value]) => ({ name, value }));
  }, [stats]);

  const experienceChartData = useMemo(() => {
    const expMap = responses.reduce((acc: any, curr) => {
      acc[curr.experience_years] = (acc[curr.experience_years] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(expMap).map(([name, value]) => ({ name, value }));
  }, [responses]);

  const trainingNeedsData = useMemo(() => {
    const counts = responses.reduce((acc: any, curr) => {
      const needs = curr.summary?.top_training_needs || [];
      needs.forEach(need => {
        acc[need] = (acc[need] || 0) + 1;
      });
      return acc;
    }, {});
    return Object.entries(counts)
      .sort((a: any, b: any) => b[1] - a[1])
      .map(([name, value]) => ({ name, value: value as number }));
  }, [responses]);

  const trainingMethodsData = useMemo(() => {
    const counts = responses.reduce((acc: any, curr) => {
      const methods = curr.summary?.preferred_training_method || [];
      methods.forEach(method => {
        acc[method] = (acc[method] || 0) + 1;
      });
      return acc;
    }, {});
    return Object.entries(counts).map(([name, value]) => ({ name, value: value as number }));
  }, [responses]);

  const topRole = useMemo(() => {
    if (roleChartData.length === 0) return 'N/A';
    return [...roleChartData].sort((a, b) => b.value - a.value)[0]?.name || 'N/A';
  }, [roleChartData]);

  const getQuestionLabel = (category: string, userType: string, role: string) => {
    if (userType === 'Virtual Assistant (Medical & Business)') {
      const commonMapping = {
        background: "Part I – Background & Experience",
        tasksWorkflow: "Part II – Tasks and Workflow",
        trainingNeeds: "Part III – Competencies / Skills",
        communication: "Part IV – Communication Skills",
        aiEssentials: "Part V – AI Essentials",
        final: "Final Open Feedback"
      };

      const mapping: Record<string, Record<string, string>> = {
        'Medical Biller': {
          challenges: "Business Impacting Tasks",
          trainingNeeds: commonMapping.trainingNeeds,
          systemRequirements: "Most Used Billing Systems",
          tasksWorkflowOperations: commonMapping.tasksWorkflow,
          workflowSystemEfficiency: "Billing Systems & Efficiency",
          aiEssentials: commonMapping.aiEssentials,
          performance: "Client Performance Rating"
        },
        'Medical Receptionist': {
          challenges: "Business Impacting Tasks",
          trainingNeeds: commonMapping.trainingNeeds,
          systemRequirements: "Most Used Scheduling Systems",
          tasksWorkflowOperations: commonMapping.tasksWorkflow,
          workflowSystemEfficiency: "Scheduling Systems & Efficiency",
          communicationCoordination: "Patient Interaction & Etiquette",
          aiEssentials: commonMapping.aiEssentials,
          performance: "Client Performance Rating"
        },
        'Medical Administrative Assistant': {
          challenges: "Business Impacting Tasks",
          trainingNeeds: commonMapping.trainingNeeds,
          systemRequirements: "Most Used Admin Systems",
          tasksWorkflowOperations: commonMapping.tasksWorkflow,
          workflowSystemEfficiency: "Admin Systems & Efficiency",
          communicationCoordination: commonMapping.communication,
          aiEssentials: commonMapping.aiEssentials,
          performance: "Client Performance Rating"
        },
        'Medical Scribe': {
          challenges: "Business Impacting Tasks",
          trainingNeeds: commonMapping.trainingNeeds,
          systemRequirements: "Most Used EMR Systems",
          tasksWorkflowOperations: commonMapping.tasksWorkflow,
          workflowSystemEfficiency: "EMR Systems & Efficiency",
          aiEssentials: commonMapping.aiEssentials,
          performance: "Client Performance Rating"
        },
        'Health Educator': {
          challenges: "Business Impacting Tasks",
          trainingNeeds: commonMapping.trainingNeeds,
          systemRequirements: "Most Used Coaching Platforms",
          tasksWorkflowOperations: commonMapping.tasksWorkflow,
          workflowSystemEfficiency: "Coaching Systems & Efficiency",
          aiEssentials: commonMapping.aiEssentials,
          performance: "Client Performance Rating"
        },
        'Dental Receptionist': {
          challenges: "Business Impacting Tasks",
          trainingNeeds: commonMapping.trainingNeeds,
          systemRequirements: "Most Used Dental Software",
          tasksWorkflowOperations: commonMapping.tasksWorkflow,
          workflowSystemEfficiency: "Dental Software & Efficiency",
          aiEssentials: commonMapping.aiEssentials,
          performance: "Client Performance Rating"
        },
        'Dental Biller': {
          challenges: "Business Impacting Tasks",
          trainingNeeds: commonMapping.trainingNeeds,
          systemRequirements: "Most Used Dental Billing Software",
          tasksWorkflowOperations: commonMapping.tasksWorkflow,
          workflowSystemEfficiency: "Dental Billing Systems & Efficiency",
          aiEssentials: commonMapping.aiEssentials,
          performance: "Client Performance Rating"
        },
        'Executive Assistant VA': {
          challenges: "Business Impacting Tasks",
          trainingNeeds: commonMapping.trainingNeeds,
          systemRequirements: "Most Used Admin & Planning Tools",
          tasksWorkflowOperations: commonMapping.tasksWorkflow,
          workflowSystemEfficiency: "Admin Systems & Efficiency",
          communicationCoordination: commonMapping.communication,
          aiEssentials: commonMapping.aiEssentials,
          performance: "Client Performance Rating"
        },
        'General Business VA': {
          challenges: "Business Impacting Tasks",
          trainingNeeds: commonMapping.trainingNeeds,
          systemRequirements: "Most Used Business Tools",
          tasksWorkflowOperations: commonMapping.tasksWorkflow,
          workflowSystemEfficiency: "Business Systems & Efficiency",
          communicationCoordination: commonMapping.communication,
          aiEssentials: commonMapping.aiEssentials,
          performance: "Client Performance Rating"
        }
      };
      return mapping[role]?.[category] || null;
    } else if (userType === 'Support Team') {
      const roleSections = SUPPORT_SURVEY_SCHEMA.roleSections[role as keyof typeof SUPPORT_SURVEY_SCHEMA.roleSections] || [];
      for (const section of roleSections) {
        const question = section.questions.find(q => q.id === category);
        if (question) return question.label;
      }
    }
    return null;
  };

  const roleReportData = useMemo(() => {
    const isSupport = reportType === 'Support';
    
    const roleResponses = responses.filter(res => {
      const matchesType = isSupport ? res.user_type === 'Support Team' : res.user_type === 'Virtual Assistant (Medical & Business)';
      const matchesRole = reportRoleFilter === 'All' || res.role.split(', ').map(r => r.trim()).includes(reportRoleFilter);
      const matchesExp = reportExpFilter === 'All' || res.experience_years === reportExpFilter;
      const date = res.submitted_at.toDate();
      const matchesStart = !reportStartDate || date >= new Date(reportStartDate);
      const matchesEnd = !reportEndDate || date <= new Date(reportEndDate + 'T23:59:59');
      return matchesType && matchesRole && matchesExp && matchesStart && matchesEnd;
    });

    const aggregateGenericSection = (sectionKey: string, fields: string | string[], isArray = false) => {
      const counts: any = {};
      const fieldList = Array.isArray(fields) ? fields : [fields];
      roleResponses.forEach(res => {
        fieldList.forEach(field => {
          const val = res.sections?.[sectionKey]?.[field];
          if (isArray && Array.isArray(val)) {
            val.forEach(v => { counts[v] = (counts[v] || 0) + 1; });
          } else if (val && typeof val === 'object' && !Array.isArray(val)) {
            Object.entries(val).forEach(([row, col]) => {
              if (col !== 'NA') {
                if (isArray) {
                  if (col === '1' || col === '2' || col === 'Very Difficult' || col === 'Difficult') {
                    counts[row] = (counts[row] || 0) + 1;
                  }
                } else {
                  counts[row] = (counts[row] || 0) + 1;
                }
              }
            });
          } else if (val) {
            counts[val] = (counts[val] || 0) + 1;
          }
        });
      });
      return Object.entries(counts)
        .sort((a: any, b: any) => b[1] - a[1])
        .map(([name, value]) => ({ name, value: value as number }));
    };

    const mergeAggregates = (arrays: { name: string, value: number }[][]) => {
      const merged: any = {};
      arrays.forEach(arr => {
        arr.forEach(item => {
          merged[item.name] = (merged[item.name] || 0) + item.value;
        });
      });
      return Object.entries(merged)
        .sort((a: any, b: any) => b[1] - a[1])
        .map(([name, value]) => ({ name, value: value as number }));
    };

    const roleIdMap: Record<string, string> = {
      'Medical Biller': 'biller',
      'Medical Receptionist': 'receptionist',
      'Medical Administrative Assistant': 'admin',
      'Medical Scribe': 'scribe',
      'Health Educator': 'health-educator',
      'Dental Receptionist': 'dental-receptionist',
      'Dental Biller': 'dental-biller',
      'Executive Assistant VA': 'ea',
      'General Business VA': 'gb'
    };

    const vaRoles = Object.keys(roleIdMap);
    const supportRoles = ['CDVO / OS', 'Sales and Placement'];

    if (isSupport) {
      const topRole = roleResponses.length > 0 ? 
        Object.entries(roleResponses.reduce((acc: any, curr) => {
          const r = curr.sections?.['support-role']?.support_role || 'N/A';
          acc[r] = (acc[r] || 0) + 1;
          return acc;
        }, {})).sort((a: any, b: any) => b[1] - a[1])[0][0] : 'N/A';

      return {
        total: roleResponses.length,
        topRole,
        part1: aggregateGenericSection('support-role', ['support_role', 'support_department']),
        part2: mergeAggregates([
          aggregateGenericSection('cdvo-client-feedback', ['cdvo_skills_meet_expectations', 'cdvo_skills_need_improvement', 'cdvo_skill_gaps_dissatisfaction'], true),
          aggregateGenericSection('sales-placement-ease', 'placement_difficulty_grid', true)
        ]),
        part3: mergeAggregates([
          aggregateGenericSection('cdvo-communication-skills', 'cdvo_comm_criticality_grid', true),
          aggregateGenericSection('sales-communication-skills', 'sales_comm_criticality_grid', true)
        ]),
        part4: mergeAggregates([
          aggregateGenericSection('cdvo-ai-essentials', ['cdvo_critical_ai_tools', 'cdvo_lacking_ai_skills'], true),
          aggregateGenericSection('sales-ai-essentials', ['sales_expected_ai_tools', 'sales_lacking_ai_skills', 'sales_ai_improvement_impact'], true)
        ]),
        part5: [],
      };
    }

    const topVARole = roleResponses.length > 0 ? 
      Object.entries(roleResponses.reduce((acc: any, curr) => {
        const r = curr.role || 'N/A';
        acc[r] = (acc[r] || 0) + 1;
        return acc;
      }, {})).sort((a: any, b: any) => b[1] - a[1])[0][0] : 'N/A';

    return {
      total: roleResponses.length,
      topRole: topVARole,
      part1: mergeAggregates([
        aggregateGenericSection('client-initial', ['practice_type', 'va_tenure']),
        ...vaRoles.map(r => {
          const id = roleIdMap[r];
          return aggregateGenericSection(`${id}-background`, ['software_tools', 'practice_types'], true);
        })
      ]).slice(0, 15),
      part2: mergeAggregates(vaRoles.map(r => {
        const id = roleIdMap[r];
        return aggregateGenericSection(`${id}-tasks-workflow`, [`${id}_task_difficulty`, 'task_grid', `${id}_time_consuming_tasks`, `${id}_desired_improvements`], true);
      })).slice(0, 15),
      part3: mergeAggregates(vaRoles.map(r => {
        const id = roleIdMap[r];
        return aggregateGenericSection(`${id}-competencies-skills`, ['competencies_skills', 'specialized_skills'], true);
      })).slice(0, 20),
      part4: mergeAggregates(vaRoles.map(r => {
        const id = roleIdMap[r];
        return aggregateGenericSection(`${id}-communication-skills`, [`${id}_comm_difficulty`, 'comm_difficulty_grid', 'verbal_comm_confidence', `${id}_speaking_confidence`], true);
      })).slice(0, 15),
      part5: mergeAggregates(vaRoles.map(r => {
        const id = roleIdMap[r];
        return aggregateGenericSection(`${id}-ai-essentials`, [
          'ai_automation_level', 
          'ai_tool_proficiency', 
          'ai_usage_areas', 
          'ai_skills_to_learn',
          `${id}_ai_usage`,
          `${id}_ai_tool_comfort`,
          `${id}_ai_usage_areas`,
          `${id}_ai_skills_to_learn`
        ], true);
      })).slice(0, 15),
      part6: mergeAggregates(vaRoles.map(r => {
        const sectionId = `${r.toLowerCase().replace(/ /g, '-')}-readiness-preferences`;
        return aggregateGenericSection(sectionId, [
          'learning_format_preference',
          'ideal_training_frequency',
          'va_preparedness_rating',
          'support_system_effectiveness'
        ], true);
      })).slice(0, 15),
      
      // Legacy fields for backward compatibility if needed in UI
      challenges: mergeAggregates(vaRoles.map(r => {
        const id = roleIdMap[r];
        return aggregateGenericSection(`${id}-challenges`, 'challenges_scenarios', true);
      })).slice(0, 10),
      trainingNeeds: mergeAggregates(vaRoles.map(r => {
        const id = roleIdMap[r];
        return aggregateGenericSection(`${id}-competencies`, ['competencies_skills', 'specialized_skills'], true);
      })).slice(0, 15),
      systemRequirements: mergeAggregates(vaRoles.map(r => {
        const id = roleIdMap[r];
        return aggregateGenericSection(`${id}-background`, 'software_tools', true);
      })).slice(0, 10),
      tasksWorkflowOperations: mergeAggregates(vaRoles.map(r => {
        const id = roleIdMap[r];
        return aggregateGenericSection(`${id}-tasks-workflow`, 'task_grid', true);
      })).slice(0, 10),
      aiEssentials: mergeAggregates(vaRoles.map(r => {
        const id = roleIdMap[r];
        return aggregateGenericSection(`${id}-final`, ['ai_automation_level', 'ai_tool_proficiency'], false);
      })).slice(0, 10),
      
      clientPerformanceByRole: (() => {
        const roleData: Record<string, { total: number, count: number }> = {};
        responses.forEach(res => {
          if (res.user_type !== 'Virtual Assistant (Medical & Business)') return;
          const roles = res.role.split(', ').map(r => r.trim());
          roles.forEach(vaRole => {
            const sectionId = `${vaRole}-tasks-workflow`;
            const grid = res.sections?.[sectionId]?.['task_grid'];
            if (grid && typeof grid === 'object') {
              let totalScore = 0;
              let totalCount = 0;
              Object.values(grid).forEach((val: any) => {
                const numVal = val === 'Easy' ? 4 : val === 'Manageable' ? 3 : val === 'Difficult' ? 2 : val === 'Very Difficult' ? 1 : Number(val);
                if (!isNaN(numVal)) {
                  totalScore += numVal;
                  totalCount++;
                }
              });
              if (totalCount > 0) {
                if (!roleData[vaRole]) roleData[vaRole] = { total: 0, count: 0 };
                roleData[vaRole].total += (totalScore / totalCount);
                roleData[vaRole].count += 1;
              }
            }
          });
        });
        return Object.entries(roleData)
          .map(([name, data]) => ({ name, value: Number((data.total / data.count).toFixed(2)) }))
          .sort((a, b) => a.value - b.value);
      })(),
    };
  }, [responses, reportRoleFilter, reportExpFilter, reportStartDate, reportEndDate, reportType]);

  const renderAnswerValue = (value: any) => {
    if (value === null || value === undefined || value === '') return 'N/A';
    
    if (Array.isArray(value)) {
      if (value.length === 0) return 'None selected';
      return (
        <div className="flex flex-wrap gap-2">
          {value.map((v, i) => (
            <span key={i} className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-slate-700 font-medium">
              {String(v)}
            </span>
          ))}
        </div>
      );
    }
    
    if (typeof value === 'object' && !Array.isArray(value)) {
      const entries = Object.entries(value);
      if (entries.length === 0) return 'No data';
      
      return (
        <div className="grid grid-cols-1 divide-y divide-slate-100 bg-white rounded-xl border border-slate-100 overflow-hidden">
          {entries.map(([label, val]) => (
            <div key={label} className="flex justify-between items-center p-3 hover:bg-slate-50 transition-colors">
              <span className="text-slate-500 font-medium text-xs max-w-[65%]">{label}</span>
              <span className="px-2 py-0.5 bg-brand-teal/10 text-brand-teal rounded text-xs font-bold ring-1 ring-brand-teal/20">
                {String(val)}
              </span>
            </div>
          ))}
        </div>
      );
    }
    
    return <p className="text-slate-700 font-medium">{String(value)}</p>;
  };

  const surveyAnalysisData = useMemo(() => {
    const isSupportRole = Object.keys(SUPPORT_SURVEY_SCHEMA.roleSections).includes(analysisRole);
    const schema: any = isSupportRole ? SUPPORT_SURVEY_SCHEMA : CLIENT_SURVEY_SCHEMA;

    if (!schema) return [];

    const filteredResponses = responses.filter(res => {
      if (analysisRole === 'All') {
        return res.user_type === 'Virtual Assistant (Medical & Business)';
      }
      
      const roles = res.role.split(', ').map(r => r.trim());
      if (!roles.includes(analysisRole)) return false;
      
      if (isSupportRole) {
        return res.user_type === 'Support Team';
      } else {
        return res.user_type === 'Virtual Assistant (Medical & Business)';
      }
    });

    const allQuestions: any[] = [];
    
    if (schema.initial && schema.initial.questions) {
      allQuestions.push(...schema.initial.questions.map((q: any) => ({ ...q, sectionId: isSupportRole ? 'support-role' : 'client-initial' })));
    }

    if (schema.roleSections) {
      Object.entries(schema.roleSections).forEach(([roleName, sections]: [string, any]) => {
        if (analysisRole === 'All' || analysisRole === roleName) {
          sections.forEach((section: any) => {
            if (section.questions) {
              allQuestions.push(...section.questions.map((q: any) => ({ ...q, sectionId: section.id, roleName })));
            }
          });
        }
      });
    }

    const results = allQuestions.map(question => {
      const aggregation: any = {
        id: question.id,
        label: question.label,
        type: question.type,
        options: question.options || [],
        totalResponses: 0,
        data: {},
        average: 0,
        responses: []
      };

      filteredResponses.forEach(res => {
        const answer = res.sections?.[question.sectionId]?.[question.id];
        if (answer !== undefined && answer !== null) {
          aggregation.totalResponses++;
          
          if (question.type === 'radio' || question.type === 'select') {
            aggregation.data[answer] = (aggregation.data[answer] || 0) + 1;
          } else if (question.type === 'checkbox') {
            if (Array.isArray(answer)) {
              answer.forEach((val: any) => {
                aggregation.data[val] = (aggregation.data[val] || 0) + 1;
              });
            }
          } else if (question.type === 'scale') {
            aggregation.data[answer] = (aggregation.data[answer] || 0) + 1;
            aggregation.average += Number(answer);
          } else if (question.type === 'grid') {
            Object.entries(answer).forEach(([row, col]: [string, any]) => {
              if (!aggregation.data[row]) aggregation.data[row] = {};
              aggregation.data[row][col] = (aggregation.data[row][col] || 0) + 1;
            });
          } else if (question.type === 'textarea' || question.type === 'text') {
            aggregation.responses.push(answer);
          }
        }
      });

      if (aggregation.totalResponses > 0 && question.type === 'scale') {
        aggregation.average = Number((aggregation.average / aggregation.totalResponses).toFixed(2));
      }

      return aggregation;
    });

    return results.filter(r => r.totalResponses > 0);
  }, [responses, analysisRole]);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const exportData = responses.map(res => {
        const baseData: any = {
          ID: res.id,
          Timestamp: format(res.submitted_at.toDate(), 'yyyy-MM-dd HH:mm:ss'),
          FullName: res.full_name,
          Email: res.email,
          UserType: res.user_type,
          Role: res.role,
          PracticeType: res.practice_type || 'N/A',
          VACount: res.va_count || 'N/A',
        };

        // Dynamically add all section data
        if (res.sections) {
          Object.entries(res.sections).forEach(([sectionId, sectionData]: [string, any]) => {
            Object.entries(sectionData).forEach(([questionId, value]: [string, any]) => {
              // Create a readable key
              const key = `${sectionId.replace(/-/g, '_')}_${questionId}`;
              
              if (value && typeof value === 'object' && !Array.isArray(value)) {
                // For grids, flatten them
                Object.entries(value).forEach(([row, col]) => {
                  baseData[`${key}_${row.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '')}`] = col;
                });
              } else if (Array.isArray(value)) {
                baseData[key] = value.join(', ');
              } else {
                baseData[key] = value;
              }

              // Include "other" and "details" if they exist
              const otherKey = `${questionId}_other`;
              if (sectionData[otherKey]) {
                baseData[`${key}_other`] = sectionData[otherKey];
              }
              const detailsKey = `${questionId}_details`;
              if (sectionData[detailsKey]) {
                baseData[`${key}_details`] = JSON.stringify(sectionData[detailsKey]);
              }
            });
          });
        }

        return baseData;
      });

      const csv = await json2csv(exportData);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `mmm_survey_responses_${format(new Date(), 'yyyy-MM-dd')}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Export failed:", error);
      alert("Failed to export data. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/admin/login');
  };

  const handleDeleteResponse = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setDeleteConfirm({ type: 'single', id });
  };

  const confirmDelete = async () => {
    if (!deleteConfirm) return;
    setIsDeleting(true);
    
    try {
      if (deleteConfirm.type === 'single' && deleteConfirm.id) {
        await deleteDoc(doc(db, 'responses', deleteConfirm.id));
        if (selectedResponse?.id === deleteConfirm.id) setSelectedResponse(null);
        setSelectedResponseIds(prev => prev.filter(item => item !== deleteConfirm.id));
        console.log("Successfully deleted response", deleteConfirm.id);
      } else if (deleteConfirm.type === 'selected') {
        const batch = writeBatch(db);
        selectedResponseIds.forEach(id => {
          batch.delete(doc(db, 'responses', id));
        });
        await batch.commit();
        console.log(`Successfully deleted ${selectedResponseIds.length} responses`);
        setSelectedResponseIds([]);
        if (selectedResponse && selectedResponseIds.includes(selectedResponse.id)) {
          setSelectedResponse(null);
        }
      } else if (deleteConfirm.type === 'all') {
        const batchSize = 500;
        for (let i = 0; i < responses.length; i += batchSize) {
          const batch = writeBatch(db);
          const chunk = responses.slice(i, i + batchSize);
          chunk.forEach(res => {
            batch.delete(doc(db, 'responses', res.id));
          });
          await batch.commit();
        }
        console.log("Successfully deleted all responses");
        setSelectedResponseIds([]);
        setSelectedResponse(null);
      }
      setDeleteConfirm(null);
      alert("Successfully deleted responses.");
    } catch (error) {
      console.error("Error during deletion:", error);
      alert("Failed to delete. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteSelected = () => {
    if (selectedResponseIds.length === 0) return;
    setDeleteConfirm({ type: 'selected' });
  };

  const handleDeleteAll = () => {
    if (responses.length === 0) return;
    setDeleteConfirm({ type: 'all' });
  };

  const toggleSelectResponse = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedResponseIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedResponseIds.length === filteredResponses.length) {
      setSelectedResponseIds([]);
    } else {
      setSelectedResponseIds(filteredResponses.map(r => r.id));
    }
  };

  const handleCopyEmail = (email: string) => {
    navigator.clipboard.writeText(email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const getSummaryField = (res: SurveyResponse | null, type: 'challenge' | 'training' | 'method') => {
    if (!res || !res.sections) return 'N/A';
    
    const roleIdMap: Record<string, string> = {
      'Medical Biller': 'biller',
      'Medical Receptionist': 'receptionist',
      'Medical Administrative Assistant': 'admin',
      'Medical Scribe': 'scribe',
      'Health Educator': 'health-educator',
      'Dental Receptionist': 'dental-receptionist',
      'Dental Biller': 'dental-biller',
      'Executive Assistant VA': 'ea',
      'General Business VA': 'gb'
    };

    const role = roleIdMap[res.role] || res.role;
    
    if (type === 'challenge') {
      return res.sections[`${role}-final`]?.biggest_challenge || 
             res.sections[`${role}-challenges`]?.daily_challenges?.join(', ') || 
             res.sections[`${role}-tasks-workflow`]?.time_consuming_tasks?.join(', ') ||
             res.sections[`${role}-tasks-workflow`]?.biller_time_consuming_tasks?.join(', ') ||
             'N/A';
    }
    
    if (type === 'training') {
      const needs = res.sections[`${role}-competencies-skills`]?.competencies_skills || 
                    res.sections[`${role}-training-needs`]?.competencies_skills || 
                    res.sections[`${role}-competencies`]?.competencies_skills || 
                    res.sections[`${role}-training-skill`]?.specialized_training_needs || [];
      return Array.isArray(needs) ? (needs.length > 0 ? needs.join(', ') : 'N/A') : (needs || 'N/A');
    }
    
    if (type === 'method') {
      // Check for training preferences in various possible locations
      const prefs = res.sections[`${role}-preferences`]?.training_preference || 
                    res.sections[`${role}-final`]?.training_preference || [];
      return Array.isArray(prefs) ? (prefs.length > 0 ? prefs.join(', ') : 'N/A') : (prefs || 'N/A');
    }
    
    return 'N/A';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white border-b border-gray-200 p-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2 text-blue-600">
          <LayoutDashboard className="h-6 w-6" />
          <span className="font-bold text-lg tracking-tight text-gray-900">Admin Panel</span>
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          {isMobileMenuOpen ? <LogOut className="h-6 w-6 rotate-180" /> : <Filter className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
            />
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              className="fixed inset-y-0 left-0 w-64 bg-white z-50 lg:hidden shadow-2xl"
            >
              <div className="p-6">
                <div className="flex items-center gap-3 text-blue-600 mb-8">
                  <LayoutDashboard className="h-8 w-8" />
                  <span className="font-bold text-xl tracking-tight text-gray-900">Admin Panel</span>
                </div>
                <nav className="space-y-1">
                  {[
                    { id: 'overview', label: 'Overview', icon: TrendingUp },
                    { id: 'responses', label: 'All Responses', icon: Database },
                    { id: 'reports', label: 'Reports', icon: FileText },
                    { id: 'survey-insights', label: 'Survey Insights', icon: ClipboardList }
                  ].map((tab) => (
                    <button 
                      key={tab.id}
                      onClick={() => {
                        setActiveTab(tab.id as any);
                        setIsMobileMenuOpen(false);
                      }}
                      className={cn(
                        "w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors",
                        activeTab === tab.id ? "text-blue-600 bg-blue-50" : "text-gray-600 hover:bg-gray-50"
                      )}
                    >
                      <tab.icon className="h-5 w-5" />
                      {tab.label}
                    </button>
                  ))}
                  <Link 
                    to="/" 
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <ArrowLeft className="h-5 w-5" />
                    Back to Survey
                  </Link>
                </nav>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Sidebar (Desktop) */}
      <div className="w-64 bg-white border-r border-gray-200 fixed h-full hidden lg:block">
        <div className="p-6">
          <div className="flex items-center gap-3 text-blue-600 mb-8">
            <LayoutDashboard className="h-8 w-8" />
            <span className="font-bold text-xl tracking-tight text-gray-900">Admin Panel</span>
          </div>
          
          <nav className="space-y-1">
            <button 
              onClick={() => setActiveTab('overview')}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors",
                activeTab === 'overview' ? "text-blue-600 bg-blue-50" : "text-gray-600 hover:bg-gray-50"
              )}
            >
              <TrendingUp className="h-5 w-5" />
              Overview
            </button>
            <button 
              onClick={() => setActiveTab('responses')}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors",
                activeTab === 'responses' ? "text-blue-600 bg-blue-50" : "text-gray-600 hover:bg-gray-50"
              )}
            >
              <Database className="h-5 w-5" />
              All Responses
            </button>
            <button 
              onClick={() => setActiveTab('reports')}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors",
                activeTab === 'reports' ? "text-blue-600 bg-blue-50" : "text-gray-600 hover:bg-gray-50"
              )}
            >
              <FileText className="h-5 w-5" />
              Reports
            </button>
            <button 
              onClick={() => setActiveTab('survey-insights')}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors",
                activeTab === 'survey-insights' ? "text-blue-600 bg-blue-50" : "text-gray-600 hover:bg-gray-50"
              )}
            >
              <ClipboardList className="h-5 w-5" />
              Survey Insights
            </button>
            <Link 
              to="/" 
              className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              Back to Survey
            </Link>
          </nav>
        </div>
        
        <div className="absolute bottom-0 w-full p-6 border-t border-gray-100">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="h-5 w-5" />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 lg:ml-64 p-8">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {activeTab === 'overview' && 'Dashboard Overview'}
              {activeTab === 'responses' && 'All Survey Responses'}
              {activeTab === 'reports' && 'Survey Reports'}
              {activeTab === 'survey-insights' && 'Survey Insights'}
            </h1>
            <p className="text-gray-500 mt-1">
              {activeTab === 'overview' && `Welcome back, ${auth.currentUser?.email}`}
              {activeTab === 'responses' && `Managing ${responses.length} total submissions`}
              {activeTab === 'reports' && 'Aggregate insights and data analysis'}
              {activeTab === 'survey-insights' && 'Question-by-question aggregate analysis'}
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            {activeTab === 'responses' && (
              <>
                {selectedResponseIds.length > 0 && (
                  <button 
                    onClick={handleDeleteSelected}
                    disabled={isDeleting}
                    className="flex items-center gap-2 px-4 py-2 bg-red-50 border border-red-200 rounded-lg text-sm font-medium text-red-600 hover:bg-red-100 transition-all shadow-sm disabled:opacity-50"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete Selected ({selectedResponseIds.length})
                  </button>
                )}
                <button 
                  onClick={handleDeleteAll}
                  disabled={isDeleting || responses.length === 0}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-red-200 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-all shadow-sm disabled:opacity-50"
                >
                  <AlertCircle className="h-4 w-4" />
                  Delete All
                </button>
              </>
            )}
            <button 
              onClick={handleExport}
              disabled={isExporting}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all shadow-sm disabled:opacity-50"
            >
              <Download className="h-4 w-4" />
              {isExporting ? 'Exporting...' : 'Export CSV'}
            </button>
          </div>
        </header>

        {activeTab === 'overview' && (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard title="Total Responses" value={stats.total} icon={Users} color="blue" />
              <StatCard title="This Week" value={stats.thisWeek} icon={Calendar} color="green" trend="+12%" />
              <StatCard title="This Month" value={stats.thisMonth} icon={Clock} color="purple" />
              <StatCard title="Avg. Experience" value={`${stats.avgExp}y`} icon={TrendingUp} color="orange" />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-6">Responses by Role</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={roleChartData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 8, fill: '#6b7280' }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#6b7280' }} />
                      <Tooltip 
                        cursor={{ fill: '#f9fafb' }}
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                        formatter={(value: number) => {
                          const percentage = ((value / stats.total) * 100).toFixed(1);
                          return [`${value} (${percentage}%)`, 'Responses'];
                        }}
                      />
                      <Bar dataKey="value" fill={COLORS[0]} radius={[4, 4, 0, 0]} barSize={30} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-6">Responses by Practice Type</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={practiceTypeChartData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 8, fill: '#6b7280' }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#6b7280' }} />
                      <Tooltip 
                        cursor={{ fill: '#f9fafb' }}
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                        formatter={(value: number) => {
                          const percentage = ((value / stats.total) * 100).toFixed(1);
                          return [`${value} (${percentage}%)`, 'Responses'];
                        }}
                      />
                      <Bar dataKey="value" fill={COLORS[1]} radius={[4, 4, 0, 0]} barSize={30} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Recent Table Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900">Recent Submissions</h3>
                <button 
                  onClick={() => setActiveTab('responses')}
                  className="text-sm font-medium text-blue-600 hover:text-blue-700"
                >
                  View All
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50/50">
                      <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Respondent</th>
                      <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                      <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Submitted</th>
                      <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {responses.slice(0, 5).map((res) => (
                      <tr 
                        key={res.id} 
                        onClick={() => setSelectedResponse(res)}
                        className="hover:bg-gray-50 cursor-pointer transition-colors group"
                      >
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">{res.full_name}</span>
                            <span className="text-sm text-gray-500">{res.email}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {res.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {format(res.submitted_at.toDate(), 'MMM d, yyyy')}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                            View Details <ChevronRight className="h-4 w-4" />
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {activeTab === 'responses' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <h3 className="text-lg font-bold text-gray-900">All Submissions</h3>
              
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="Search name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all w-full md:w-64"
                  />
                </div>
                
                <select 
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="All">All Roles</option>
                  <option value="Medical Receptionist">Medical Receptionist</option>
                  <option value="Medical Administrative Assistant">Medical Administrative Assistant</option>
                  <option value="Medical Biller">Medical Biller</option>
                  <option value="Medical Scribe">Medical Scribe</option>
                  <option value="Health Educator">Health Educator</option>
                  <option value="Dental Receptionist">Dental Receptionist</option>
                  <option value="Dental Biller">Dental Biller</option>
                  <option value="Executive Assistant VA">Executive Assistant VA</option>
                  <option value="General Business VA">General Business VA</option>
                  <option value="Other">Other</option>
                </select>

                <select 
                  value={expFilter}
                  onChange={(e) => setExpFilter(e.target.value)}
                  className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="All">All Experience</option>
                  {EXPERIENCE_OPTIONS.filter(opt => {
                    if (roleFilter === "General Business VA" || roleFilter === "Executive Assistant VA") {
                      return opt !== "No prior healthcare experience";
                    } else if (roleFilter !== "All") {
                      return opt !== "No prior Business VA experience";
                    }
                    return true;
                  }).map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">From:</span>
                    <input 
                      type="date" 
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="px-2 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">To:</span>
                    <input 
                      type="date" 
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="px-2 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  {(startDate || endDate) && (
                    <button 
                      onClick={() => { setStartDate(''); setEndDate(''); }}
                      className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600 transition-colors"
                      title="Clear date filter"
                    >
                      <AlertCircle className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50">
                    <th className="px-6 py-4 w-10">
                      <button 
                        onClick={(e) => { e.stopPropagation(); toggleSelectAll(); }}
                        className="text-gray-400 hover:text-blue-600 transition-colors"
                      >
                        {selectedResponseIds.length === filteredResponses.length && filteredResponses.length > 0 ? (
                          <CheckSquare className="h-5 w-5 text-blue-600" />
                        ) : (
                          <Square className="h-5 w-5" />
                        )}
                      </button>
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Respondent</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Submitted</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredResponses.map((res) => (
                    <tr 
                      key={res.id} 
                      onClick={() => setSelectedResponse(res)}
                      className={cn(
                        "hover:bg-gray-50 cursor-pointer transition-colors group",
                        selectedResponseIds.includes(res.id) && "bg-blue-50/30"
                      )}
                    >
                      <td className="px-6 py-4">
                        <button 
                          onClick={(e) => toggleSelectResponse(res.id, e)}
                          className="text-gray-400 hover:text-blue-600 transition-colors"
                        >
                          {selectedResponseIds.includes(res.id) ? (
                            <CheckSquare className="h-5 w-5 text-blue-600" />
                          ) : (
                            <Square className="h-5 w-5" />
                          )}
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-900">{res.full_name}</span>
                          <span className="text-sm text-gray-500">{res.email}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-600">
                          {res.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {format(res.submitted_at.toDate(), 'MMM d, yyyy HH:mm')}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={(e) => handleDeleteResponse(res.id, e)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                            title="Delete Response"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 group-hover:translate-x-0 transition-transform">
                            View <ChevronRight className="h-4 w-4" />
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {filteredResponses.length === 0 && (
                <div className="p-12 text-center">
                  <div className="mx-auto h-12 w-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <AlertCircle className="h-6 w-6 text-gray-400" />
                  </div>
                  <h4 className="text-gray-900 font-medium">No responses found</h4>
                  <p className="text-gray-500 text-sm">Try adjusting your filters or search term.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="space-y-8">
            {/* Report Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200">
                  <BarChart3 className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900 tracking-tight">Aggregate Analysis</h2>
                  <p className="text-sm text-slate-500 font-medium">Insights for filtered data</p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2 bg-slate-50 p-1 rounded-2xl border border-slate-100">
                  <button 
                    onClick={() => { setReportType('VA'); setReportRoleFilter('All'); }}
                    className={cn(
                      "px-4 py-2 rounded-xl text-xs font-bold transition-all",
                      reportType === 'VA' ? "bg-white text-blue-600 shadow-sm border border-slate-100" : "text-slate-500 hover:text-slate-700"
                    )}
                  >
                    Virtual Assistant
                  </button>
                  <button 
                    onClick={() => { setReportType('Support'); setReportRoleFilter('All'); }}
                    className={cn(
                      "px-4 py-2 rounded-xl text-xs font-bold transition-all",
                      reportType === 'Support' ? "bg-white text-blue-600 shadow-sm border border-slate-100" : "text-slate-500 hover:text-slate-700"
                    )}
                  >
                    MMM Support
                  </button>
                </div>

                <select 
                  value={reportRoleFilter}
                  onChange={(e) => setReportRoleFilter(e.target.value)}
                  className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-700 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                >
                  <option value="All">All Roles</option>
                  {reportType === 'VA' ? (
                    <>
                      <option value="Medical Receptionist">Medical Receptionist</option>
                      <option value="Medical Administrative Assistant">Medical Administrative Assistant</option>
                      <option value="Medical Biller">Medical Biller</option>
                      <option value="Medical Scribe">Medical Scribe</option>
                      <option value="Health Educator">Health Educator</option>
                      <option value="Dental Receptionist">Dental Receptionist</option>
                      <option value="Dental Biller">Dental Biller</option>
                      <option value="Executive Assistant VA">Executive Assistant VA</option>
                      <option value="General Business VA">General Business VA</option>
                    </>
                  ) : (
                    <>
                      <option value="CDVO / OS">CDVO / OS</option>
                      <option value="Sales and Placement">Sales and Placement</option>
                    </>
                  )}
                </select>

                <div className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-2xl border border-slate-200">
                  <Calendar className="h-4 w-4 text-slate-400" />
                  <input 
                    type="date" 
                    value={reportStartDate}
                    onChange={(e) => setReportStartDate(e.target.value)}
                    className="bg-transparent text-xs font-bold text-slate-700 outline-none"
                  />
                  <span className="text-slate-300">→</span>
                  <input 
                    type="date" 
                    value={reportEndDate}
                    onChange={(e) => setReportEndDate(e.target.value)}
                    className="bg-transparent text-xs font-bold text-slate-700 outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Users className="h-16 w-16 text-blue-600" />
                </div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Responses</p>
                <h4 className="text-3xl font-black text-slate-900 font-mono">{roleReportData.total}</h4>
                <div className="mt-4 flex items-center gap-2">
                  <span className="px-2 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold rounded-lg uppercase tracking-wider">Filtered Data</span>
                </div>
              </div>
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Star className="h-16 w-16 text-amber-500" />
                </div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Top Role</p>
                <h4 className="text-xl font-bold text-slate-900 truncate pr-12">{roleReportData.topRole}</h4>
                <div className="mt-4 flex items-center gap-2">
                  <span className="px-2 py-1 bg-amber-50 text-amber-600 text-[10px] font-bold rounded-lg uppercase tracking-wider">Most Active</span>
                </div>
              </div>
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Zap className="h-16 w-16 text-purple-600" />
                </div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Report Context</p>
                <h4 className="text-xl font-bold text-slate-900">{reportType === 'VA' ? 'Virtual Assistant' : 'MMM Support'}</h4>
                <div className="mt-4 flex items-center gap-2">
                  <span className="px-2 py-1 bg-purple-50 text-purple-600 text-[10px] font-bold rounded-lg uppercase tracking-wider">Role Specific</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Part 1 */}
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 lg:col-span-2">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-black text-lg">1</div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                        {reportType === 'VA' ? 'Part I - Background & Systems' : 'Part I - Support Role Information'}
                      </h3>
                      <p className="text-xs text-slate-400 font-medium italic">General background and tool usage</p>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={roleReportData.part1} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                        <XAxis type="number" hide />
                        <YAxis 
                          dataKey="name" 
                          type="category" 
                          width={180} 
                          tick={{ fontSize: 10, fill: '#64748b', fontWeight: 600 }}
                          axisLine={false}
                          tickLine={false}
                        />
                        <Tooltip 
                          cursor={{ fill: '#f8fafc' }}
                          contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                        />
                        <Bar dataKey="value" fill="#3b82f6" radius={[0, 8, 8, 0]} barSize={24} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex flex-col justify-center">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Quick Insights</p>
                    <div className="space-y-4">
                      {roleReportData.part1.slice(0, 3).map((item, i) => (
                        <div key={i} className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-600">{item.name}</span>
                          <span className="text-xs font-mono font-bold text-blue-600">{item.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Part 2 */}
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-10 h-10 bg-green-50 text-green-600 rounded-xl flex items-center justify-center font-black text-lg">2</div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                      {reportType === 'VA' ? 'Part II - Tasks & Workflow' : 'Part II - Feedback & Placement'}
                    </h3>
                    <p className="text-xs text-slate-400 font-medium italic">Operational efficiency and feedback</p>
                  </div>
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={roleReportData.part2.slice(0, 8)} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                      <XAxis type="number" hide />
                      <YAxis dataKey="name" type="category" width={140} tick={{ fontSize: 10, fill: '#64748b', fontWeight: 600 }} axisLine={false} tickLine={false} />
                      <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                      <Bar dataKey="value" fill="#10b981" radius={[0, 8, 8, 0]} barSize={20} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Part 3 */}
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center font-black text-lg">3</div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                      {reportType === 'VA' ? 'Part III - Competencies & Skills' : 'Part III - Communication Skills'}
                    </h3>
                    <p className="text-xs text-slate-400 font-medium italic">Core skills and critical areas</p>
                  </div>
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={roleReportData.part3.slice(0, 8)} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                      <XAxis type="number" hide />
                      <YAxis dataKey="name" type="category" width={140} tick={{ fontSize: 10, fill: '#64748b', fontWeight: 600 }} axisLine={false} tickLine={false} />
                      <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                      <Bar dataKey="value" fill="#8b5cf6" radius={[0, 8, 8, 0]} barSize={20} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Part 4 */}
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 lg:col-span-2">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-10 h-10 bg-red-50 text-red-600 rounded-xl flex items-center justify-center font-black text-lg">4</div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                      {reportType === 'VA' ? 'Part IV - Communication Skills' : 'Part IV - AI Essentials'}
                    </h3>
                    <p className="text-xs text-slate-400 font-medium italic">Pain points and technology adoption</p>
                  </div>
                </div>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={roleReportData.part4} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                      <XAxis type="number" hide />
                      <YAxis dataKey="name" type="category" width={180} tick={{ fontSize: 10, fill: '#64748b', fontWeight: 600 }} axisLine={false} tickLine={false} />
                      <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                      <Bar dataKey="value" fill="#ef4444" radius={[0, 8, 8, 0]} barSize={24} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Part 5 (VA Only) */}
              {reportType === 'VA' && (
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 lg:col-span-2">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-10 h-10 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center font-black text-lg">5</div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 tracking-tight">Part V - AI Essentials</h3>
                      <p className="text-xs text-slate-400 font-medium italic">Future-proofing and AI proficiency</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={roleReportData.part5}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {roleReportData.part5.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip contentStyle={{ borderRadius: '16px', border: 'none' }} />
                          <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '10px', fontWeight: 600 }} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="space-y-4 flex flex-col justify-center">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Top AI Mentions</p>
                      {roleReportData.part5.slice(0, 4).map((item, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
                          <span className="text-xs font-bold text-slate-700">{item.name}</span>
                          <span className="ml-auto text-xs font-mono font-bold text-slate-400">{item.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Client Performance Rating (VA Only) */}
              {reportType === 'VA' && (
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 lg:col-span-2">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
                      <Star className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 tracking-tight">Client Performance Rating by Role</h3>
                      <p className="text-xs text-slate-400 font-medium italic">Average proficiency scores (1.0 - 4.0)</p>
                    </div>
                  </div>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={roleReportData.clientPerformanceByRole} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                        <XAxis type="number" domain={[0, 4]} hide />
                        <YAxis 
                          dataKey="name" 
                          type="category" 
                          width={180} 
                          tick={{ fontSize: 10, fill: '#64748b', fontWeight: 600 }}
                          axisLine={false}
                          tickLine={false}
                        />
                        <Tooltip 
                          cursor={{ fill: '#f8fafc' }}
                          contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                          formatter={(value: number) => [`${value} / 4.0`, 'Avg. Rating']}
                        />
                        <Bar dataKey="value" fill="#fbbf24" radius={[0, 8, 8, 0]} barSize={24}>
                          {roleReportData.clientPerformanceByRole.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.value >= 3.5 ? '#10b981' : entry.value >= 3.0 ? '#3b82f6' : entry.value >= 2.5 ? '#fbbf24' : '#ef4444'} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#10b981] shadow-sm shadow-green-200"></div> Advanced (3.5+)</div>
                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#3b82f6] shadow-sm shadow-blue-200"></div> Proficient (3.0+)</div>
                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#fbbf24] shadow-sm shadow-amber-200"></div> Developing (2.5+)</div>
                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#ef4444] shadow-sm shadow-red-200"></div> Basic (&lt;2.5)</div>
                  </div>
                </div>
              )}

              {/* Part 6 (VA Only) */}
              {reportType === 'VA' && roleReportData.part6 && roleReportData.part6.length > 0 && (
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 lg:col-span-2">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-10 h-10 bg-brand-teal/10 text-brand-teal rounded-xl flex items-center justify-center font-black text-lg">6</div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 tracking-tight">Part VI - Learning Preferences & Role Readiness</h3>
                      <p className="text-xs text-slate-400 font-medium italic">Upskilling readiness and system effectiveness</p>
                    </div>
                  </div>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={roleReportData.part6} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                        <XAxis type="number" hide />
                        <YAxis dataKey="name" type="category" width={200} tick={{ fontSize: 10, fill: '#64748b', fontWeight: 600 }} axisLine={false} tickLine={false} />
                        <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                        <Bar dataKey="value" fill="#0d9488" radius={[0, 8, 8, 0]} barSize={24} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'survey-insights' && (
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 tracking-tight">Survey Insights</h2>
                  <p className="text-sm text-gray-500">Question-by-question aggregate analysis</p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <select
                    value={analysisRole}
                    onChange={(e) => setAnalysisRole(e.target.value)}
                    className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                  >
                    <option value="All">All VA Roles</option>
                    <optgroup label="Virtual Assistant Roles">
                      {Object.keys(CLIENT_SURVEY_SCHEMA.roleSections).map(role => (
                        <option key={role} value={role}>{role}</option>
                      ))}
                    </optgroup>
                    <optgroup label="Support Team Roles">
                      {Object.keys(SUPPORT_SURVEY_SCHEMA.roleSections).map(role => (
                        <option key={role} value={role}>{role}</option>
                      ))}
                    </optgroup>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-8">
                {surveyAnalysisData.map((question, idx) => (
                  <div key={idx} className="bg-gray-50/50 rounded-2xl p-6 border border-gray-100">
                    <div className="flex items-start justify-between gap-4 mb-6">
                      <div className="flex-1">
                        <h3 className="text-base font-bold text-gray-900 leading-snug">{question.label}</h3>
                        <div className="flex items-center gap-3 mt-2">
                          <span className="text-xs font-medium text-gray-500 bg-white px-2 py-1 rounded-md border border-gray-200">
                            {question.type.toUpperCase()}
                          </span>
                          <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-md border border-blue-100">
                            {question.totalResponses} Responses
                          </span>
                          {question.type === 'scale' && (
                            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-100">
                              Avg: {question.average}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {(question.type === 'radio' || question.type === 'checkbox' || question.type === 'scale' || question.type === 'select') && (
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart 
                            layout="vertical" 
                            data={Object.entries(question.data).map(([name, value]) => ({ 
                              name: name.length > 40 ? name.substring(0, 37) + '...' : name, 
                              fullName: name,
                              value 
                            })).sort((a, b) => (b.value as number) - (a.value as number))}
                            margin={{ left: 100, right: 40 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                            <XAxis type="number" hide />
                            <YAxis 
                              type="category" 
                              dataKey="name" 
                              width={100}
                              tick={{ fontSize: 10, fill: '#64748b', fontWeight: 500 }}
                              axisLine={false}
                              tickLine={false}
                            />
                            <Tooltip 
                              cursor={{ fill: '#f1f5f9' }}
                              content={({ active, payload }) => {
                                if (active && payload && payload.length) {
                                  const data = payload[0].payload;
                                  const percentage = ((data.value / question.totalResponses) * 100).toFixed(1);
                                  return (
                                    <div className="bg-white p-3 rounded-xl shadow-xl border border-gray-100">
                                      <p className="text-xs font-bold text-gray-900 mb-1 max-w-xs">{data.fullName}</p>
                                      <div className="flex items-center gap-2">
                                        <span className="text-lg font-black text-blue-600">{data.value}</span>
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">({percentage}%)</span>
                                      </div>
                                    </div>
                                  );
                                }
                                return null;
                              }}
                            />
                            <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    )}

                    {question.type === 'grid' && (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse bg-white rounded-xl overflow-hidden border border-gray-200">
                          <thead>
                            <tr className="bg-gray-50">
                              <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-200">Task / Skill</th>
                              {Object.values(question.data)[0] && Object.keys(Object.values(question.data)[0] as any).map(col => (
                                <th key={col} className="px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-200 text-center">{col}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {Object.entries(question.data).map(([row, cols]: [string, any]) => (
                              <tr key={row}>
                                <td className="px-4 py-3 text-sm font-medium text-gray-900 border-r border-gray-100">{row}</td>
                                {Object.entries(cols).map(([col, count]: [string, any]) => (
                                  <td key={col} className="px-4 py-3 text-center">
                                    <div className="flex flex-col items-center">
                                      <span className="text-sm font-bold text-blue-600">{count}</span>
                                      <span className="text-[10px] text-gray-400 font-medium">({((count / question.totalResponses) * 100).toFixed(0)}%)</span>
                                    </div>
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}

                    {(question.type === 'textarea' || question.type === 'text') && (
                      <div className="space-y-3 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                        {question.responses.slice(0, 10).map((resp: string, rIdx: number) => (
                          <div key={rIdx} className="p-4 bg-white rounded-xl border border-gray-200 text-sm text-gray-600 italic">
                            "{resp}"
                          </div>
                        ))}
                        {question.responses.length > 10 && (
                          <p className="text-xs text-gray-400 text-center italic">Showing top 10 of {question.responses.length} responses</p>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden"
            >
              <div className="p-8">
                <div className="w-16 h-16 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mb-6">
                  <Trash2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">
                  {deleteConfirm.type === 'all' ? 'Delete All Responses?' : 
                   deleteConfirm.type === 'selected' ? `Delete ${selectedResponseIds.length} Responses?` : 
                   'Delete Response?'}
                </h3>
                <p className="text-slate-500 leading-relaxed">
                  This action is permanent and cannot be undone. Are you sure you want to proceed?
                </p>
              </div>
              <div className="p-6 bg-slate-50 flex items-center gap-3 justify-end">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  disabled={isDeleting}
                  className="px-6 py-2.5 text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={isDeleting}
                  className="px-8 py-2.5 bg-red-600 text-white text-sm font-bold rounded-xl hover:bg-red-700 transition-all shadow-lg shadow-red-200 disabled:opacity-50 flex items-center gap-2"
                >
                  {isDeleting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    'Confirm Delete'
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedResponse && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm print:p-0 print:bg-white">
            <motion.div 
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.98 }}
              className="bg-white w-full max-w-5xl max-h-[90vh] overflow-hidden rounded-3xl shadow-2xl flex flex-col print:max-h-none print:shadow-none print:rounded-none"
            >
              {/* Modal Header */}
              <div className="bg-white border-b border-slate-100 p-6 flex items-center justify-between sticky top-0 z-10 print:static">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-200">
                    {selectedResponse.full_name.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 leading-tight">{selectedResponse.full_name}</h2>
                    <div className="flex items-center gap-3 text-sm text-slate-500">
                      <button 
                        onClick={() => handleCopyEmail(selectedResponse.email)}
                        className="flex items-center gap-1.5 hover:text-blue-600 transition-colors group"
                      >
                        {selectedResponse.email}
                        {copiedEmail ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />}
                      </button>
                      <span>•</span>
                      <span className="font-medium text-slate-700">{selectedResponse.role}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 print:hidden">
                  <button 
                    onClick={() => handleDeleteResponse(selectedResponse.id)}
                    className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                    title="Delete Response"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                  <button 
                    onClick={handlePrint}
                    className="p-2.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                    title="Print Response"
                  >
                    <Printer className="h-5 w-5" />
                  </button>
                  <button 
                    onClick={() => setSelectedResponse(null)}
                    className="p-2.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto p-8 print:p-0 print:overflow-visible">
                <div id="printable-response" className="space-y-12 max-w-4xl mx-auto">
                  {/* Quick Stats Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">User Type</p>
                      <p className="text-blue-600 font-bold text-lg">{selectedResponse.user_type}</p>
                    </div>
                    <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Role/VA Role</p>
                      <p className="text-slate-900 font-bold text-lg">{selectedResponse.role}</p>
                    </div>
                    <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Submitted</p>
                      <p className="text-slate-600 font-medium">{format(selectedResponse.submitted_at.toDate(), 'MMM d, yyyy')}</p>
                    </div>
                    <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Email</p>
                      <p className="text-slate-600 font-medium truncate" title={selectedResponse.email}>{selectedResponse.email}</p>
                    </div>
                  </div>

                  {/* Summary Section */}
                  {selectedResponse.user_type === 'Virtual Assistant (Medical & Business)' && (
                    <div className="bg-blue-50/50 p-6 rounded-3xl border border-blue-100 space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-bold text-blue-900 flex items-center gap-2">
                          <Zap className="h-5 w-5" /> Response Summary
                        </h3>
                        <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest bg-blue-100/50 px-2 py-1 rounded-lg">VA Insights</span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-1">
                          <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Biggest Challenge</p>
                          <p className="text-sm text-slate-700 italic leading-relaxed">"{getSummaryField(selectedResponse, 'challenge')}"</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Top Training Needs</p>
                          <p className="text-sm text-slate-700 font-medium">{getSummaryField(selectedResponse, 'training')}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Preferred Method</p>
                          <p className="text-sm text-slate-700 font-medium">{getSummaryField(selectedResponse, 'method')}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Detailed Sections */}
                  <div className="space-y-16">
                    {selectedResponse.user_type === 'Virtual Assistant (Medical & Business)' && (
                      <>
                        <section className="space-y-6">
                          <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                              <Database className="w-5 h-5" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900">Practice & Client Information</h3>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div>
                              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Practice Type</h4>
                              <p className="text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-100 text-sm">
                                {selectedResponse.sections?.['client-initial']?.practice_type === 'Other' 
                                  ? `Other: ${selectedResponse.sections?.['client-initial']?.practice_type_other || 'N/A'}`
                                  : (selectedResponse.sections?.['client-initial']?.practice_type || 'N/A')}
                              </p>
                            </div>
                            <div>
                              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">VA Count</h4>
                              <p className="text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-100 text-sm">
                                {selectedResponse.sections?.['client-initial']?.va_count || 'N/A'}
                              </p>
                            </div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div>
                              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">VA Role Feedback</h4>
                              <p className="text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-100 text-sm">
                                {selectedResponse.sections?.['client-initial']?.va_role_feedback || 'N/A'}
                              </p>
                            </div>
                          </div>
                        </section>

                        {/* Display role-specific sections if they exist */}
                        {Object.entries(selectedResponse.sections || {}).map(([sectionId, data]: [string, any]) => {
                          if (sectionId === 'client-initial') return null;
                          
                          // Find section title from schema
                          let sectionTitle = sectionId.replace(/-/g, ' ');
                          const roleSections = CLIENT_SURVEY_SCHEMA.roleSections[selectedResponse.role as keyof typeof CLIENT_SURVEY_SCHEMA.roleSections] || [];
                          const schemaSection = roleSections.find(s => s.id === sectionId);
                          if (schemaSection) {
                            sectionTitle = schemaSection.title;
                          }

                          return (
                            <section key={sectionId} className="space-y-6">
                              <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                                <div className="p-2.5 bg-slate-50 text-slate-600 rounded-xl">
                                  <FileText className="w-5 h-5" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 capitalize">{sectionTitle}</h3>
                              </div>
                              <div className="grid grid-cols-1 gap-6">
                                {Object.entries(data).map(([key, value]: [string, any]) => {
                                  // Find question label from schema
                                  let questionLabel = key.replace(/_/g, ' ');
                                  if (schemaSection) {
                                    const question = schemaSection.questions.find(q => q.id === key);
                                    if (question) {
                                      questionLabel = question.label;
                                    }
                                  }

                                  return (
                                    <div key={key}>
                                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">{questionLabel}</h4>
                                      <div className="text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-100 text-sm">
                                        {renderAnswerValue(value)}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </section>
                          );
                        })}
                      </>
                    )}

                    {selectedResponse.user_type === 'Support Team' && (
                      <>
                        <section className="space-y-6">
                          <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                              <Database className="w-5 h-5" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900">Support Role Information</h3>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div>
                              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Support Email</h4>
                              <p className="text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-100 text-sm">
                                {selectedResponse.sections?.['support-role']?.support_email || selectedResponse.email || 'N/A'}
                              </p>
                            </div>
                            <div>
                              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Support Role</h4>
                              <p className="text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-100 text-sm">
                                {selectedResponse.sections?.['support-role']?.support_role || 'N/A'}
                              </p>
                            </div>
                          </div>
                        </section>

                        {/* Display role-specific sections if they exist */}
                        {Object.entries(selectedResponse.sections || {}).map(([sectionId, data]: [string, any]) => {
                          if (sectionId === 'support-role') return null;
                          
                          // Find section title from schema
                          let sectionTitle = sectionId.replace(/-/g, ' ');
                          const roleSections = SUPPORT_SURVEY_SCHEMA.roleSections[selectedResponse.role as keyof typeof SUPPORT_SURVEY_SCHEMA.roleSections] || [];
                          const schemaSection = roleSections.find(s => s.id === sectionId);
                          if (schemaSection) {
                            sectionTitle = schemaSection.title;
                          }

                          return (
                            <section key={sectionId} className="space-y-6">
                              <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                                <div className="p-2.5 bg-slate-50 text-slate-600 rounded-xl">
                                  <FileText className="w-5 h-5" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 capitalize">{sectionTitle}</h3>
                              </div>
                              <div className="grid grid-cols-1 gap-6">
                                {Object.entries(data).map(([key, value]: [string, any]) => {
                                  // Find question label from schema
                                  let questionLabel = key.replace(/_/g, ' ');
                                  if (schemaSection) {
                                    const question = schemaSection.questions.find(q => q.id === key);
                                    if (question) {
                                      questionLabel = question.label;
                                    }
                                  }

                                  return (
                                    <div key={key}>
                                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">{questionLabel}</h4>
                                      <div className="text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-100 text-sm">
                                        {renderAnswerValue(value)}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </section>
                          );
                        })}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const StatCard: React.FC<{ 
  title: string; 
  value: string | number; 
  icon: any; 
  color: string;
  trend?: string;
}> = ({ title, value, icon: Icon, color, trend }) => {
  const colorClasses: any = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    purple: "bg-purple-50 text-purple-600",
    orange: "bg-orange-50 text-orange-600",
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
        <div className="flex items-baseline gap-2">
          <h4 className="text-2xl font-bold text-gray-900">{value}</h4>
          {trend && (
            <span className="text-xs font-medium text-green-600 flex items-center">
              <ArrowUpRight className="h-3 w-3" />
              {trend}
            </span>
          )}
        </div>
      </div>
      <div className={cn("p-3 rounded-xl", colorClasses[color])}>
        <Icon className="h-6 w-6" />
      </div>
    </div>
  );
};

export default AdminDashboard;
