import { Question } from "../types";
import { Check } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface QuestionRendererProps {
  key?: string | number;
  question: Question;
  value: any;
  otherValue?: string;
  optionDetails?: Record<string, string>;
  onChange: (value: any) => void;
  onOtherChange?: (value: string) => void;
  onOptionDetailChange?: (option: string, value: string) => void;
  fullResponse?: Record<string, any>;
  error?: string;
}

export function QuestionRenderer({
  question,
  value,
  otherValue,
  optionDetails = {},
  onChange,
  onOtherChange,
  onOptionDetailChange,
  fullResponse = {},
  error,
}: QuestionRendererProps) {
  const renderInput = () => {
    const options = question.optionsMap && question.dependsOn 
      ? question.optionsMap[fullResponse[question.dependsOn]] 
      : question.options;

    switch (question.type) {
      case "text":
        return (
          <input
            type="text"
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-teal focus:border-transparent outline-none transition-all"
            placeholder="Type your answer here..."
          />
        );

      case "textarea":
        return (
          <textarea
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-teal focus:border-transparent outline-none transition-all min-h-[120px]"
            placeholder="Type your detailed answer here..."
          />
        );

      case "radio":
        if (!options) return null;
        return (
          <div className="space-y-3">
            {options.map((option) => (
              <div key={option} className="h-full">
                <label
                  className={`flex flex-col p-4 rounded-xl border cursor-pointer transition-all h-full ${
                    value === option
                      ? "border-brand-teal bg-brand-teal/5 text-brand-teal shadow-sm"
                      : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                  onDoubleClick={() => {
                    if (value === option) {
                      onChange(undefined);
                    }
                  }}
                >
                  <div className="flex items-center">
                    <input
                      type="radio"
                      name={question.id}
                      value={option}
                      checked={value === option}
                      onChange={() => onChange(option)}
                      className="hidden"
                    />
                    <div
                      className={`w-5 h-5 rounded-full border-2 mr-3 flex-shrink-0 flex items-center justify-center transition-colors ${
                        value === option ? "border-brand-teal" : "border-slate-300"
                      }`}
                    >
                      <AnimatePresence>
                        {value === option && (
                          <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                            className="w-2.5 h-2.5 bg-brand-teal rounded-full"
                          />
                        )}
                      </AnimatePresence>
                    </div>
                    <span className="font-medium">{option}</span>
                  </div>

                  {((option === "Other" && value === "Other") || 
                    (question.optionsWithInputs?.includes(option) && value === option)) && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-4 pt-4 border-t border-brand-teal/10"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <label className="block text-xs font-bold text-brand-teal/70 mb-2 uppercase tracking-wider">
                        {option === "Other" ? "If other, please specify:" : `Please specify ${option.toLowerCase()}:`}
                      </label>
                      <input
                        type="text"
                        value={option === "Other" ? (otherValue || "") : (optionDetails[option] || "")}
                        onChange={(e) => {
                          if (option === "Other") {
                            onOtherChange?.(e.target.value);
                          } else {
                            onOptionDetailChange?.(option, e.target.value);
                          }
                        }}
                        className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-brand-teal focus:border-transparent outline-none transition-all bg-white text-slate-900"
                        placeholder={option === "Other" ? "Please specify..." : `Enter ${option.toLowerCase()} name...`}
                        autoFocus={option === "Other"}
                      />
                    </motion.div>
                  )}
                </label>
              </div>
            ))}
          </div>
        );

      case "checkbox":
        if (!options) return null;
        const currentValues = Array.isArray(value) ? value : [];
        const handleCheckboxChange = (option: string) => {
          let newValues;
          if (currentValues.includes(option)) {
            newValues = currentValues.filter((v: string) => v !== option);
          } else {
            if (question.maxSelections && currentValues.length >= question.maxSelections) {
              return;
            }
            newValues = [...currentValues, option];
          }
          onChange(newValues);
        };

        return (
          <div className={question.variant === "grid" ? "grid grid-cols-1 md:grid-cols-2 gap-4" : "space-y-3"}>
            {options.map((option) => (
              <div key={option} className="h-full">
                <label
                  className={`flex flex-col p-4 rounded-xl border cursor-pointer transition-all h-full ${
                    currentValues.includes(option)
                      ? "border-brand-teal bg-brand-teal/5 text-brand-teal shadow-sm"
                      : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                  } ${question.variant === "grid" ? "hover:scale-[1.02] active:scale-[0.98]" : ""}`}
                >
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={currentValues.includes(option)}
                      onChange={() => handleCheckboxChange(option)}
                      className="hidden"
                    />
                    <div
                      className={`w-5 h-5 rounded border-2 mr-3 flex-shrink-0 flex items-center justify-center transition-colors ${
                        currentValues.includes(option)
                          ? "border-brand-teal bg-brand-teal"
                          : "border-slate-300"
                      }`}
                    >
                      <AnimatePresence>
                        {currentValues.includes(option) && (
                          <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                          >
                            <Check className="w-3.5 h-3.5 text-white" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                    <span className="font-medium">{option}</span>
                  </div>

                  {((option === "Other" && currentValues.includes("Other")) || 
                    (question.optionsWithInputs?.includes(option) && currentValues.includes(option))) && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-4 pt-4 border-t border-brand-teal/10"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <label className="block text-xs font-bold text-brand-teal/70 mb-2 uppercase tracking-wider">
                        {option === "Other" ? "If other, please specify:" : `Please specify ${option.toLowerCase()}:`}
                      </label>
                      <input
                        type="text"
                        value={option === "Other" ? (otherValue || "") : (optionDetails[option] || "")}
                        onChange={(e) => {
                          if (option === "Other") {
                            onOtherChange?.(e.target.value);
                          } else {
                            onOptionDetailChange?.(option, e.target.value);
                          }
                        }}
                        className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-brand-teal focus:border-transparent outline-none transition-all bg-white text-slate-900"
                        placeholder={option === "Other" ? "Please specify..." : `Enter ${option.toLowerCase()} name...`}
                        autoFocus={option === "Other"}
                      />
                    </motion.div>
                  )}
                </label>
              </div>
            ))}
            {question.maxSelections && (
              <p className={`text-xs text-slate-500 mt-2 ${question.variant === "grid" ? "col-span-full" : ""}`}>
                Select up to {question.maxSelections} options.
              </p>
            )}
          </div>
        );

      case "scale":
        const range = Array.from(
          { length: (question.max || 5) - (question.min || 1) + 1 },
          (_, i) => (question.min || 1) + i
        );
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center px-2">
              <span className="text-sm font-medium text-slate-500">{question.minLabel}</span>
              <span className="text-sm font-medium text-slate-500">{question.maxLabel}</span>
            </div>
            <div className="flex justify-between gap-2">
              {range.map((num) => (
                <div key={num} className="flex-1 flex flex-col items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onChange(num)}
                    onDoubleClick={() => {
                      if (value === num) {
                        onChange(undefined);
                      }
                    }}
                    className={`w-full py-4 rounded-xl border font-bold transition-all ${
                      value === num
                        ? "border-brand-teal bg-brand-teal/5 text-brand-teal shadow-sm"
                        : "border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-600"
                    }`}
                  >
                    {num}
                  </button>
                  {question.stepLabels?.[num] && (
                    <span className={`text-[10px] font-bold text-center leading-tight uppercase tracking-wider ${
                      value === num ? "text-brand-teal" : "text-slate-400"
                    }`}>
                      {question.stepLabels[num]}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      case "grid":
        const gridValue = (value as Record<string, string>) || {};
        let rows = question.rows || [];
        
        if (question.dynamicRowsFrom) {
          const sources = Array.isArray(question.dynamicRowsFrom) 
            ? question.dynamicRowsFrom 
            : [question.dynamicRowsFrom];
          
          const allSelectedRows: string[] = [];
          sources.forEach(sourceId => {
            const selectedRows = fullResponse[sourceId];
            if (Array.isArray(selectedRows)) {
              selectedRows.forEach(row => {
                if (row === "Other") {
                  const otherVal = fullResponse[`${sourceId}_other`];
                  if (otherVal && typeof otherVal === "string" && otherVal.trim() !== "") {
                    allSelectedRows.push(otherVal.trim());
                  }
                } else {
                  allSelectedRows.push(row);
                }
              });
            }
          });
          
          if (allSelectedRows.length > 0) {
            rows = allSelectedRows;
          } else if (sources.length > 0) {
            rows = []; // If sources are defined but nothing selected, clear rows
          }
        }

        if (rows.length === 0 && question.dynamicRowsFrom) {
          return (
            <div className="p-8 border-2 border-dashed border-slate-200 rounded-2xl text-center space-y-2">
              <p className="text-slate-500 font-medium italic">No tools selected for rating.</p>
              <p className="text-xs text-slate-400">Please go back and select the tools you use.</p>
            </div>
          );
        }

        const missingRows = rows.filter(row => !gridValue[row]);
        const hasMissingRows = rows.length > 0 && missingRows.length > 0;

        return (
          <div className="space-y-4">
            {hasMissingRows && (
              <div className="flex items-center gap-2 p-3 bg-brand-teal/10 border border-brand-teal/30 rounded-xl text-brand-teal text-sm font-medium animate-pulse">
                <Check className="w-4 h-4 rotate-180 opacity-50" />
                <span>You have {missingRows.length} unanswered row{missingRows.length > 1 ? 's' : ''} in this section.</span>
              </div>
            )}
            <div className="overflow-x-auto -mx-4 md:mx-0">
            <table className="w-full min-w-[600px] border-collapse">
              <thead>
                <tr>
                  <th className="p-4 text-left bg-slate-50 border-b border-slate-200 sticky left-0 z-10">
                    Task
                  </th>
                  {question.columns?.map((col) => (
                    <th
                      key={col}
                      className="p-4 text-center bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 border-b border-slate-100 font-medium text-slate-700 sticky left-0 bg-white z-10">
                      <div className="space-y-2">
                        <span>{row}</span>
                        {((row === "Other" && gridValue[row]) || 
                          (question.rowsWithInputs?.includes(row) && gridValue[row])) && (
                          <div className="mt-2">
                            <input
                              type="text"
                              value={row === "Other" ? (otherValue || "") : (optionDetails[row] || "")}
                              onChange={(e) => {
                                if (row === "Other") {
                                  onOtherChange?.(e.target.value);
                                } else {
                                  onOptionDetailChange?.(row, e.target.value);
                                }
                              }}
                              className="w-full px-3 py-1.5 text-sm rounded-lg border border-slate-200 focus:ring-2 focus:ring-brand-teal focus:border-transparent outline-none transition-all"
                              placeholder={row === "Other" ? "Please specify..." : `Enter ${row.toLowerCase()} name...`}
                              autoFocus={row === "Other"}
                            />
                          </div>
                        )}
                      </div>
                    </td>
                    {question.columns?.map((col) => (
                      <td key={col} className="p-4 border-b border-slate-100 text-center">
                        <label 
                          className="inline-flex items-center justify-center w-full h-full cursor-pointer"
                          onDoubleClick={() => {
                            if (gridValue[row] === col) {
                              onChange({
                                ...gridValue,
                                [row]: undefined,
                              });
                            }
                          }}
                        >
                          <input
                            type="radio"
                            name={`${question.id}-${row}`}
                            value={col}
                            checked={gridValue[row] === col}
                            onChange={() =>
                              onChange({
                                ...gridValue,
                                [row]: col,
                              })
                            }
                            className="hidden"
                          />
                          <div
                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                              gridValue[row] === col
                                ? "border-brand-teal bg-brand-teal/5"
                                : "border-slate-300"
                            }`}
                          >
                            <AnimatePresence>
                              {gridValue[row] === col && (
                                <motion.div
                                  initial={{ scale: 0, opacity: 0 }}
                                  animate={{ scale: 1, opacity: 1 }}
                                  exit={{ scale: 0, opacity: 0 }}
                                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                  className="w-3 h-3 bg-brand-teal rounded-full"
                                />
                              )}
                            </AnimatePresence>
                          </div>
                        </label>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );

    default:
      return null;
  }
};

  const shouldShow = () => {
    if (!question.dependsOn) return true;
    const parentValue = fullResponse[question.dependsOn];
    if (!parentValue) return false;
    
    if (question.dependsOnValue) {
      const values = Array.isArray(question.dependsOnValue) ? question.dependsOnValue : [question.dependsOnValue];
      if (Array.isArray(parentValue)) {
        return parentValue.some(v => values.includes(v));
      }
      return values.includes(parentValue as string);
    }
    
    return true;
  };

  if (!shouldShow()) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-lg font-semibold text-slate-900 mb-1 whitespace-pre-wrap">
          {question.label}
          {question.required && <span className="text-red-500 ml-1">*</span>}
        </label>
        {question.description && (
          <p className="text-sm text-slate-500 mb-3 whitespace-pre-wrap">{question.description}</p>
        )}
      </div>
      {renderInput()}
      {error && <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
        <span className="inline-block w-1 h-1 bg-red-500 rounded-full"></span>
        {error}
      </p>}
    </div>
  );
}
