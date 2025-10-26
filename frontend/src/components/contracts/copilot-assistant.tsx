import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Sparkles,
  X,
  Loader2,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  AlertTriangle,
  Shield,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { analyzeClause, type ClauseAnalysis } from "@/lib/ai-copilot-engine";

interface Message {
  id: string;
  type: "user" | "assistant" | "system";
  content: string;
  clauseId?: string;
  timestamp: Date;
}

interface CopilotAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  onRegenerateClause?: (clauseId: string, newContent: string) => void;
  initialClauseId?: string;
  initialClauseText?: string;
}

export function CopilotAssistant({
  isOpen,
  onClose,
  onRegenerateClause,
  initialClauseId,
  initialClauseText,
}: CopilotAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<string>("");
  const [analysis, setAnalysis] = useState<ClauseAnalysis | null>(null);
  const [currentStep, setCurrentStep] = useState<number>(0);

  // Function to reset chat state for fresh start
  const resetChatState = () => {
    setMessages([]);
    setGeneratedContent("");
    setAnalysis(null);
    setCurrentStep(0);
    setIsGenerating(false);
  };

  // Initialize welcome message when panel opens
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage: Message = {
        id: "welcome",
        type: "assistant",
        content: `Hi! I've analyzed this clause and detected some compliance issues. The clause "${initialClauseText?.slice(0, 60)}..." needs improvement.\n\nWould you like me to regenerate it with enhanced compliance and legal strength?`,
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen, initialClauseText, messages.length]);

  // Reset chat state when panel closes
  useEffect(() => {
    if (!isOpen) {
      // Delay reset to allow exit animation to complete
      const timer = setTimeout(() => {
        resetChatState();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleRegenerate = async () => {
    setIsGenerating(true);
    setCurrentStep(0);

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: "Yes, please regenerate this clause with better compliance.",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);

    await new Promise((resolve) => setTimeout(resolve, 800));

    // Run comprehensive analysis
    const clauseData = {
      clause_id: initialClauseId,
      content: initialClauseText,
      text: initialClauseText,
      heading: initialClauseText?.split('\n')[0] || "Clause",
    };

    const analysisResult = analyzeClause(clauseData);
    setAnalysis(analysisResult);

    // Step 1: Initial analysis
    setCurrentStep(1);
    const step1Message: Message = {
      id: (Date.now() + 1).toString(),
      type: "system",
      content: analysisResult.analysisSteps[0] || "Analyzing clause structure...",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, step1Message]);
    await new Promise((resolve) => setTimeout(resolve, 600));

    // Step 2: Legal language check
    setCurrentStep(2);
    const step2Message: Message = {
      id: (Date.now() + 2).toString(),
      type: "system",
      content: analysisResult.analysisSteps[1] || "Checking legal language...",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, step2Message]);
    await new Promise((resolve) => setTimeout(resolve, 600));

    // Step 3: Type-specific requirements
    setCurrentStep(3);
    const step3Message: Message = {
      id: (Date.now() + 3).toString(),
      type: "system",
      content: analysisResult.analysisSteps[2] || "Verifying requirements...",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, step3Message]);
    await new Promise((resolve) => setTimeout(resolve, 600));

    // Step 4: Regulatory compliance
    setCurrentStep(4);
    const step4Message: Message = {
      id: (Date.now() + 4).toString(),
      type: "system",
      content: analysisResult.analysisSteps[3] || "Cross-referencing regulations...",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, step4Message]);
    await new Promise((resolve) => setTimeout(resolve, 600));

    // Step 5: Risk assessment
    setCurrentStep(5);
    const step5Message: Message = {
      id: (Date.now() + 5).toString(),
      type: "system",
      content: analysisResult.analysisSteps[4] || "Assessing risk level...",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, step5Message]);
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Analysis complete - show findings
    const findingsMessage: Message = {
      id: (Date.now() + 6).toString(),
      type: "assistant",
      content: `Analysis complete! I've identified **${analysisResult.issues.length} structural issues** and **${analysisResult.complianceGaps.length} compliance gaps**.\n\n**Risk Level:** ${analysisResult.riskLevel}\n\nGenerating improved version...`,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, findingsMessage]);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setGeneratedContent(analysisResult.improvedVersion);

    // Add final message with improvements
    const improvementsMessage: Message = {
      id: (Date.now() + 7).toString(),
      type: "assistant",
      content: `I've regenerated the clause with the following improvements:\n\n${analysisResult.recommendations.map((r, i) => `${i + 1}. ${r}`).join('\n')}\n\nThe improved version addresses all identified issues and enhances legal enforceability.`,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, improvementsMessage]);

    setIsGenerating(false);
    setCurrentStep(0);
  };

  const handleAccept = () => {
    if (initialClauseId && generatedContent && onRegenerateClause) {
      onRegenerateClause(initialClauseId, generatedContent);

      const successMessage: Message = {
        id: Date.now().toString(),
        type: "system",
        content: "✓ Clause updated successfully! The contract will be re-analyzed.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, successMessage]);

      setTimeout(() => {
        resetChatState();
        onClose();
      }, 2000);
    }
  };

  const handleReject = () => {
    const rejectMessage: Message = {
      id: Date.now().toString(),
      type: "assistant",
      content:
        "No problem! I'll close this session. Feel free to regenerate any other clauses that need improvement.",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, rejectMessage]);

    setTimeout(() => {
      resetChatState();
      onClose();
    }, 1500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Assistant Panel */}
          <motion.div
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-2xl bg-card border-l shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b bg-linear-to-r from-primary/10 to-primary/5">
              <div className="flex items-center gap-2">
                <motion.div
                  animate={{
                    rotate: [0, 360],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <Sparkles className="size-6 text-primary" />
                </motion.div>
                <div>
                  <h2 className="text-lg font-semibold">AI Contract Assistant</h2>
                  <p className="text-xs text-muted-foreground">
                    {currentStep > 0 ? `Analyzing... Step ${currentStep}/5` : "Powered by Advanced Legal AI"}
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="size-5" />
              </Button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <AnimatePresence mode="popLayout">
                {messages.map((message, index) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{
                      duration: 0.3,
                      delay: index * 0.1,
                    }}
                    className={`flex ${
                      message.type === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                        message.type === "user"
                          ? "bg-primary text-primary-foreground ml-auto"
                          : message.type === "system"
                          ? "bg-muted/50 border border-border/50 text-muted-foreground text-sm"
                          : "bg-muted"
                      }`}
                    >
                      {message.type === "assistant" && (
                        <div className="flex items-start gap-2">
                          <Sparkles className="size-4 text-primary mt-1 shrink-0" />
                          <p className="text-sm whitespace-pre-wrap">
                            {message.content}
                          </p>
                        </div>
                      )}
                      {message.type === "user" && (
                        <p className="text-sm whitespace-pre-wrap">
                          {message.content}
                        </p>
                      )}
                      {message.type === "system" && (
                        <div className="flex items-start gap-2">
                          <Loader2 className="size-4 animate-spin mt-0.5 shrink-0" />
                          <p className="text-sm italic">{message.content}</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}

                {/* Analysis Results Card */}
                {analysis && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-card border rounded-lg p-4 space-y-3"
                  >
                    <div className="flex items-center gap-2">
                      <Shield className={`size-5 ${
                        analysis.riskLevel === "Low" ? "text-green-500" :
                        analysis.riskLevel === "Medium" ? "text-yellow-500" :
                        analysis.riskLevel === "High" ? "text-orange-500" :
                        "text-red-500"
                      }`} />
                      <h3 className="font-semibold">Analysis Results</h3>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Risk Level:</span>
                        <span className={`font-semibold ${
                          analysis.riskLevel === "Low" ? "text-green-600" :
                          analysis.riskLevel === "Medium" ? "text-yellow-600" :
                          analysis.riskLevel === "High" ? "text-orange-600" :
                          "text-red-600"
                        }`}>
                          {analysis.riskLevel}
                        </span>
                      </div>
                      
                      {analysis.issues.length > 0 && (
                        <div>
                          <span className="text-muted-foreground">Issues Found:</span>
                          <ul className="mt-1 space-y-1">
                            {analysis.issues.slice(0, 3).map((issue, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <AlertTriangle className="size-3 text-yellow-500 mt-0.5 shrink-0" />
                                <span className="text-xs">{issue}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {analysis.complianceGaps.length > 0 && (
                        <div>
                          <span className="text-muted-foreground">Compliance Gaps:</span>
                          <ul className="mt-1 space-y-1">
                            {analysis.complianceGaps.slice(0, 3).map((gap, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <FileText className="size-3 text-blue-500 mt-0.5 shrink-0" />
                                <span className="text-xs">{gap}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* Generated Content Preview */}
                {generatedContent && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="bg-linear-to-br from-primary/5 to-primary/10 border-2 border-primary/20 rounded-xl p-4"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <CheckCircle2 className="size-5 text-primary" />
                      <h3 className="font-semibold text-sm">
                        Regenerated Clause
                      </h3>
                    </div>
                    <div className="bg-card rounded-lg p-4 mb-4 max-h-64 overflow-y-auto">
                      <p className="text-sm whitespace-pre-wrap">
                        {generatedContent}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        onClick={handleAccept}
                        className="flex-1"
                        size="sm"
                      >
                        <CheckCircle2 className="size-4 mr-2" />
                        Accept & Update
                      </Button>
                      <Button
                        onClick={handleReject}
                        variant="outline"
                        className="flex-1"
                        size="sm"
                      >
                        <AlertCircle className="size-4 mr-2" />
                        Reject
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Loading State */}
              {isGenerating && !generatedContent && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center justify-center py-8"
                >
                  <div className="flex flex-col items-center gap-3">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    >
                      <Sparkles className="size-8 text-primary" />
                    </motion.div>
                    <p className="text-sm text-muted-foreground">
                      AI is analyzing and regenerating...
                    </p>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Action Footer */}
            {!generatedContent && !isGenerating && messages.length <= 1 && (
              <div className="p-4 border-t bg-muted/30">
                <Button
                  onClick={handleRegenerate}
                  className="w-full"
                  size="lg"
                  disabled={isGenerating}
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="size-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="size-4 mr-2" />
                      Regenerate Clause
                    </>
                  )}
                </Button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
