Implementing prompt-based editing for the project outline.
```

```typescript
"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Search, Lightbulb, Calendar, Trash2, Users, Code, Check, Edit, Loader2, AlertTriangle } from "lucide-react";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { useToast } from "@/hooks/use-toast";
import type { GenerateProjectOutlineOutput } from '@/ai/flows/generate-project-outline-flow';

interface SavedAnalysis {
  id: string;
  trendName: string;
  analysisMarkdown: string;
  createdAt: string;
  keyword?: string;
  targetAudience?: string | null;
  projectOutline?: string | null;
  isOutlineApproved?: boolean;
}

export default function AnalyzedIdeasPage() {
  const [analyses, setAnalyses] = useState<SavedAnalysis[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAnalysis, setSelectedAnalysis] = useState<SavedAnalysis | null>(null);

  // Outline generation states
  const [isGeneratingOutline, setIsGeneratingOutline] = useState<boolean>(false);
  const [isEditingOutline, setIsEditingOutline] = useState<boolean>(false);
  const [editPrompt, setEditPrompt] = useState('');
  const [editsRemaining, setEditsRemaining] = useState<number>(2);
  const [outlineError, setOutlineError] = useState<string | null>(null);

  const { toast } = useToast();

  useEffect(() => {
    // Load saved analyses from localStorage
    const savedAnalyses = localStorage.getItem('savedAnalyses');
    if (savedAnalyses) {
      setAnalyses(JSON.parse(savedAnalyses));
    }
  }, []);

  const filteredAnalyses = analyses.filter(analysis =>
    analysis.trendName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (analysis.keyword && analysis.keyword.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const deleteAnalysis = (id: string) => {
    const updatedAnalyses = analyses.filter(analysis => analysis.id !== id);
    setAnalyses(updatedAnalyses);
    localStorage.setItem('savedAnalyses', JSON.stringify(updatedAnalyses));
    if (selectedAnalysis?.id === id) {
      setSelectedAnalysis(null);
    }
  };

  const updateAnalysisInStorage = (updatedAnalysis: SavedAnalysis) => {
    const updatedAnalyses = analyses.map(analysis => 
      analysis.id === updatedAnalysis.id ? updatedAnalysis : analysis
    );
    setAnalyses(updatedAnalyses);
    localStorage.setItem('savedAnalyses', JSON.stringify(updatedAnalyses));
    setSelectedAnalysis(updatedAnalysis);
  };

  const handleGenerateProjectOutline = async () => {
    if (!selectedAnalysis) return;

    setIsGeneratingOutline(true);
    setOutlineError(null);

    try {
      const response = await fetch('/api/ai/generate-project-outline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          trendName: selectedAnalysis.trendName,
          analysisMarkdown: selectedAnalysis.analysisMarkdown
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to generate project outline: ${response.status}`);
      }

      const data: GenerateProjectOutlineOutput = await response.json();

      const updatedAnalysis = {
        ...selectedAnalysis,
        targetAudience: data.targetAudience,
        projectOutline: data.projectOutline,
        isOutlineApproved: false
      };

      updateAnalysisInStorage(updatedAnalysis);
      setEditPrompt('');
      setEditsRemaining(2);

      toast({
        title: "Project Outline Generated!",
        description: "You can now edit and customize the outline before approval.",
      });
    } catch (error) {
      console.error('Error generating project outline:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setOutlineError(errorMessage);

      toast({
        title: "Outline Generation Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsGeneratingOutline(false);
    }
  };

  const handleEditOutline = () => {
    if (editsRemaining > 0 && selectedAnalysis?.projectOutline) {
      setEditPrompt('');
      setIsEditingOutline(true);
    }
  };

  const handleSaveOutlineEdit = async () => {
    if (!selectedAnalysis) return;

    setIsGeneratingOutline(true);
    setOutlineError(null);

    try {
      const response = await fetch('/api/ai/generate-project-outline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          trendName: selectedAnalysis.trendName,
          analysisMarkdown: selectedAnalysis.analysisMarkdown,
          projectOutline: selectedAnalysis.projectOutline,
          editPrompt: editPrompt,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to edit project outline: ${response.status}`);
      }

      const data: GenerateProjectOutlineOutput = await response.json();

      const updatedAnalysis = {
        ...selectedAnalysis,
        projectOutline: data.projectOutline
      };

      updateAnalysisInStorage(updatedAnalysis);
      setIsEditingOutline(false);
      setEditsRemaining(prev => prev - 1);
      setEditPrompt('');

      toast({
        title: "Outline Updated",
        description: `Edit saved. You have ${editsRemaining - 1} edit${editsRemaining - 1 !== 1 ? 's' : ''} remaining.`,
      });
    } catch (error) {
      console.error('Error editing project outline:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setOutlineError(errorMessage);

      toast({
        title: "Outline Edit Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsGeneratingOutline(false);
    }
  };

  const handleCancelOutlineEdit = () => {
    setEditPrompt('');
    setIsEditingOutline(false);
  };

  const handleApproveOutline = () => {
    if (!selectedAnalysis) return;

    const updatedAnalysis = {
      ...selectedAnalysis,
      isOutlineApproved: true
    };

    updateAnalysisInStorage(updatedAnalysis);

    toast({
      title: "Project Outline Approved!",
      description: "Your project outline has been approved and saved.",
    });
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="font-headline text-3xl font-bold text-foreground flex items-center gap-2">
            <Lightbulb className="h-8 w-8 text-blue-500" />
            Analyzed Ideas
          </h1>
          <p className="text-muted-foreground mt-2">
            View and manage your saved business idea analyses
          </p>
        </div>
        <div className="relative w-full sm:w-auto sm:max-w-xs">
          <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search analyses..."
            className="w-full rounded-lg bg-background pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {analyses.length === 0 ? (
        <div className="text-center py-12">
          <Lightbulb className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <p className="text-xl text-muted-foreground">No analyzed ideas yet.</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Go to the <a href="/ideate-trends" className="text-blue-500 hover:underline">Brainstorm Ideas</a> page to generate and analyze business ideas.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left side - List of analyses */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Your Analyses ({filteredAnalyses.length})</h2>
            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {filteredAnalyses.map((analysis) => (
                <Card 
                  key={analysis.id} 
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedAnalysis?.id === analysis.id ? 'ring-2 ring-blue-500' : ''
                  }`}
                  onClick={() => setSelectedAnalysis(analysis)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <CardTitle className="text-sm font-medium line-clamp-2">
                          {analysis.trendName}
                        </CardTitle>
                        <div className="flex items-center gap-2 mt-2">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(analysis.createdAt), { addSuffix: true })}
                          </span>
                          {analysis.keyword && (
                            <Badge variant="secondary" className="text-xs">
                              {analysis.keyword}
                            </Badge>
                          )}
                          {analysis.isOutlineApproved && (
                            <Badge variant="default" className="text-xs bg-green-500">
                              <Check className="h-2 w-2 mr-1" />
                              Complete
                            </Badge>
                          )}
                          {analysis.projectOutline && !analysis.isOutlineApproved && (
                            <Badge variant="outline" className="text-xs">
                              <Code className="h-2 w-2 mr-1" />
                              Draft
                            </Badge>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-muted-foreground hover:text-red-500"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteAnalysis(analysis.id);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>

          {/* Right side - Selected analysis details */}
          <div>
            {selectedAnalysis ? (
              <Card className="h-fit">
                <CardHeader>
                  <CardTitle className="text-lg">{selectedAnalysis.trendName}</CardTitle>
                  <CardDescription className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Analyzed {formatDistanceToNow(new Date(selectedAnalysis.createdAt), { addSuffix: true })}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-base mb-3">Business Analysis</h3>
                    <div 
                      className="prose prose-sm max-w-none prose-headings:text-foreground prose-p:text-foreground prose-strong:text-foreground prose-ul:text-foreground prose-ol:text-foreground"
                      dangerouslySetInnerHTML={{ 
                        __html: selectedAnalysis.analysisMarkdown
                          .replace(/\n/g, '<br>')
                          .replace(/## (.*?)<br>/g, '<h3 class="font-semibold text-lg mt-4 mb-2">$1</h3>')
                          .replace(/### (.*?)<br>/g, '<h4 class="font-medium text-base mt-3 mb-2">$1</h4>')
                          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                          .replace(/\*(.*?)\*/g, '<em>$1</em>')
                          .replace(/- (.*?)<br>/g, '<li class="ml-4">$1</li>')
                      }}
                    />
                  </div>

                  {selectedAnalysis.targetAudience && (
                    <div>
                      <h3 className="font-semibold text-base mb-2 flex items-center">
                        <Users className="h-4 w-4 mr-2" />
                        Target Audience
                      </h3>
                      <div className="bg-muted p-3 rounded-md">
                        <pre className="whitespace-pre-wrap break-words text-sm">{selectedAnalysis.targetAudience}</pre>
                      </div>
                    </div>
                  )}

                  {/* Project Outline Generation */}
                  {!selectedAnalysis.projectOutline && !isGeneratingOutline && (
                    <div className="flex justify-center pt-4">
                      <Button onClick={handleGenerateProjectOutline} className="bg-primary hover:bg-primary/90">
                        <Code className="mr-2 h-4 w-4" />
                        Generate Project Outline
                      </Button>
                    </div>
                  )}

                  {isGeneratingOutline && (
                    <div className="flex items-center justify-center p-8 text-muted-foreground">
                      <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                      Generating project outline...
                    </div>
                  )}

                  {outlineError && (
                    <div className="text-destructive p-4 border border-destructive/50 rounded-md bg-destructive/10">
                      <p className="flex items-center font-semibold">
                          <AlertTriangle className="mr-2 h-5 w-5" /> Error Generating Outline
                      </p>
                      <p className="mt-1 text-sm">{outlineError}</p>
                    </div>
                  )}

                  {selectedAnalysis.projectOutline && (
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-base flex items-center">
                          <Code className="h-4 w-4 mr-2" />
                          Project Outline
                        </h3>
                        <div className="flex items-center gap-2">
                          {!selectedAnalysis.isOutlineApproved && (
                            <>
                              <Badge variant="secondary">
                                {editsRemaining} edit{editsRemaining !== 1 ? 's' : ''} remaining
                              </Badge>
                              {!isEditingOutline && editsRemaining > 0 && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={handleEditOutline}
                                >
                                  <Edit className="mr-1 h-3 w-3" />
                                  Edit
                                </Button>
                              )}
                            </>
                          )}
                          {selectedAnalysis.isOutlineApproved && (
                            <Badge variant="default" className="bg-green-500">
                              <Check className="h-3 w-3 mr-1" />
                              Approved
                            </Badge>
                          )}
                        </div>
                      </div>

                      {isEditingOutline ? (
                        <div className="space-y-3">
                          <Textarea
                            value={editPrompt}
                            onChange={(e) => setEditPrompt(e.target.value)}
                            className="min-h-[100px] font-mono text-sm"
                            placeholder="Enter your edit prompt..."
                          />
                          <div className="bg-card p-3 rounded-md border">
                            <pre className="whitespace-pre-wrap break-words text-sm">{selectedAnalysis.projectOutline}</pre>
                          </div>
                          <div className="flex gap-2">
                            <Button onClick={handleSaveOutlineEdit} size="sm">
                              <Check className="mr-1 h-3 w-3" />
                              Apply Edit
                            </Button>
                            <Button 
                              variant="outline" 
                              onClick={handleCancelOutlineEdit} 
                              size="sm"
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-card p-3 rounded-md border">
                          <pre className="whitespace-pre-wrap break-words text-sm">{selectedAnalysis.projectOutline}</pre>
                        </div>
                      )}

                      {!selectedAnalysis.isOutlineApproved && !isEditingOutline && selectedAnalysis.projectOutline && (
                        <div className="flex justify-center pt-4">
                          <Button 
                            onClick={handleApproveOutline}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <Check className="mr-2 h-4 w-4" />
                            Approve Project Outline
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card className="h-64 flex items-center justify-center">
                <CardContent className="text-center">
                  <p className="text-muted-foreground">Select an analysis to view details</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  );
}