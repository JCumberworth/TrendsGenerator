"use client";

import { useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Lightbulb, Zap, Loader2, AlertTriangle, Sparkles, Search, Users, Code, Edit, Check } from 'lucide-react';
import type { GeneratePotentialTrendsOutput } from '@/ai/flows/generate-potential-trends-flow';
import type { AnalyzePotentialTrendOutput } from '@/ai/flows/analyze-potential-trend-flow';
import type { GenerateProjectOutlineOutput } from '@/ai/flows/generate-project-outline-flow';
import { useToast } from "@/hooks/use-toast";

export default function IdeateTrendsPage() {
  const [topicKeyword, setTopicKeyword] = useState<string>('');
  const [potentialBusinessIdeas, setPotentialBusinessIdeas] = useState<string[]>([]);
  const [selectedIdea, setSelectedIdea] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  
  // Project outline states
  const [targetAudience, setTargetAudience] = useState<string | null>(null);
  const [projectOutline, setProjectOutline] = useState<string | null>(null);
  const [editableOutline, setEditableOutline] = useState<string>('');
  const [isEditingOutline, setIsEditingOutline] = useState<boolean>(false);
  const [editsRemaining, setEditsRemaining] = useState<number>(2);
  const [isOutlineApproved, setIsOutlineApproved] = useState<boolean>(false);

  const [isGeneratingIdeas, setIsGeneratingIdeas] = useState<boolean>(false);
  const [isAnalyzingIdea, setIsAnalyzingIdea] = useState<boolean>(false);
  const [isGeneratingOutline, setIsGeneratingOutline] = useState<boolean>(false);

  const [ideasError, setIdeasError] = useState<string | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [outlineError, setOutlineError] = useState<string | null>(null);

  const { toast } = useToast();

  const handleGenerateIdeas = async (e: FormEvent) => {
    e.preventDefault();
    if (!topicKeyword.trim() || topicKeyword.trim().length < 3) {
      setIdeasError("Please enter a topic or business area (minimum 3 characters).");
      toast({
        title: "Input Error",
        description: "Topic/business area must be at least 3 characters long.",
        variant: "destructive",
      });
      return;
    }

    setIsGeneratingIdeas(true);
    setPotentialBusinessIdeas([]);
    setSelectedIdea(null);
    setAnalysisResult(null);
    setTargetAudience(null);
    setProjectOutline(null);
    setEditableOutline('');
    setIsEditingOutline(false);
    setEditsRemaining(2);
    setIsOutlineApproved(false);
    setIdeasError(null);
    setAnalysisError(null);
    setOutlineError(null);

    try {
      const response = await fetch('/api/ai/generate-ideas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topicKeyword }),
      });
      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }
      const result: GeneratePotentialTrendsOutput = await response.json();
      if (result.potentialTrends && result.potentialTrends.length > 0) {
        setPotentialBusinessIdeas(result.potentialTrends);
        toast({
          title: "Business Ideas Generated!",
          description: "Select an idea below to analyze its potential.",
        });
      } else {
        setIdeasError("No potential business ideas were generated. Try a different keyword.");
         toast({
          title: "No Ideas Found",
          description: "The AI couldn't generate ideas for this topic. Try refining your keyword.",
          variant: "default",
        });
      }
    } catch (error) {
      console.error("Error generating potential business ideas:", error);
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
      setIdeasError(`Failed to generate ideas: ${errorMessage}`);
      toast({
        title: "Generation Failed",
        description: `Could not generate potential ideas: ${errorMessage}`,
        variant: "destructive",
      });
    } finally {
      setIsGeneratingIdeas(false);
    }
  };

  const saveAnalysisToLocalStorage = (ideaName: string, analysis: string, keyword: string, targetAud?: string, outline?: string) => {
    const savedAnalysis = {
      id: `analysis-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      trendName: ideaName,
      analysisMarkdown: analysis,
      createdAt: new Date().toISOString(),
      keyword: keyword,
      targetAudience: targetAud || null,
      projectOutline: outline || null,
      isOutlineApproved: isOutlineApproved
    };

    const existingAnalyses = JSON.parse(localStorage.getItem('savedAnalyses') || '[]');
    const updatedAnalyses = [savedAnalysis, ...existingAnalyses];
    localStorage.setItem('savedAnalyses', JSON.stringify(updatedAnalyses));
  };

  const handleGenerateProjectOutline = async () => {
    if (!selectedIdea || !analysisResult) return;

    setIsGeneratingOutline(true);
    setOutlineError(null);

    try {
      const response = await fetch('/api/ai/generate-project-outline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          trendName: selectedIdea,
          analysisMarkdown: analysisResult
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to generate project outline: ${response.status}`);
      }

      const data: GenerateProjectOutlineOutput = await response.json();
      setTargetAudience(data.targetAudience);
      setProjectOutline(data.projectOutline);
      setEditableOutline(data.projectOutline);
      setEditsRemaining(2);
      setIsOutlineApproved(false);

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
    if (editsRemaining > 0) {
      setIsEditingOutline(true);
    }
  };

  const handleSaveOutlineEdit = () => {
    setProjectOutline(editableOutline);
    setIsEditingOutline(false);
    setEditsRemaining(prev => prev - 1);

    toast({
      title: "Outline Updated",
      description: `Edit saved. You have ${editsRemaining - 1} edit${editsRemaining - 1 !== 1 ? 's' : ''} remaining.`,
    });
  };

  const handleCancelOutlineEdit = () => {
    setEditableOutline(projectOutline || '');
    setIsEditingOutline(false);
  };

  const handleApproveOutline = () => {
    setIsOutlineApproved(true);
    
    // Save the complete analysis with outline to localStorage
    if (selectedIdea && analysisResult) {
      saveAnalysisToLocalStorage(selectedIdea, analysisResult, topicKeyword, targetAudience || undefined, projectOutline || undefined);
    }

    toast({
      title: "Project Outline Approved!",
      description: "Your complete analysis with project outline has been saved.",
    });
  };

  const handleAnalyzeIdea = async (ideaName: string) => {
    setSelectedIdea(ideaName);
    setIsAnalyzingIdea(true);
    setAnalysisError(null);
    setAnalysisResult(null);

    try {
      const response = await fetch('/api/ai/analyze-idea', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trendName: ideaName }),
      });

      if (!response.ok) {
        throw new Error(`Failed to analyze idea: ${response.status}`);
      }

      const data: AnalyzePotentialTrendOutput = await response.json();
      setAnalysisResult(data.analysisMarkdown);

      toast({
        title: "Analysis Complete",
        description: "Now generate a project outline to continue.",
      });
    } catch (error) {
      console.error('Error analyzing idea:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setAnalysisError(errorMessage);

      toast({
        title: "Analysis Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsAnalyzingIdea(false);
    }
  };

  return (
    <div className="container mx-auto space-y-8">
      <header className="my-8">
        <h1 className="font-headline text-3xl font-bold text-foreground">Explore Business Opportunities</h1>
        <p className="text-muted-foreground mt-1">Get AI-powered ideas and analysis to help your business grow.</p>
      </header>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Search className="mr-2 h-6 w-6 text-primary" />
            Brainstorm New Ideas
          </CardTitle>
          <CardDescription>
            Enter a keyword, industry, or business area to generate potential opportunities.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleGenerateIdeas}>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="topicKeyword" className="font-semibold">Business Area / Keyword</Label>
              <Input
                id="topicKeyword"
                type="text"
                value={topicKeyword}
                onChange={(e) => {
                  setTopicKeyword(e.target.value);
                  if (ideasError) setIdeasError(null);
                }}
                placeholder="e.g., Local Food Delivery, Eco-Friendly Products, B2B Software"
                className="mt-1"
                disabled={isGeneratingIdeas}
              />
               {ideasError && (
                <p className="mt-2 text-sm text-destructive flex items-center">
                  <AlertTriangle className="mr-1 h-4 w-4" /> {ideasError}
                </p>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isGeneratingIdeas || !topicKeyword.trim()}>
              {isGeneratingIdeas ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Ideas...
                </>
              ) : (
                <>
                  <Lightbulb className="mr-2 h-4 w-4" />
                  Generate Business Ideas
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>

      {potentialBusinessIdeas.length > 0 && (
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center">
                <Sparkles className="mr-2 h-6 w-6 text-primary" />
                Potential Business Ideas
            </CardTitle>
            <CardDescription>Click on an idea to get a detailed AI analysis of its potential.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {potentialBusinessIdeas.map((idea, index) => (
              <Button
                key={index}
                variant="outline"
                className="justify-start text-left h-auto py-3 whitespace-normal items-start"
                onClick={() => handleAnalyzeIdea(idea)}
                disabled={isAnalyzingIdea && selectedIdea === idea}
              >
                {isAnalyzingIdea && selectedIdea === idea ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin shrink-0" />
                    <span className="min-w-0">Analyzing...</span>
                  </>
                ) : (
                  <>
                   <Zap className="mr-2 h-4 w-4 text-accent shrink-0" />
                   <span className="min-w-0">{idea}</span>
                  </>
                )}
              </Button>
            ))}
          </CardContent>
        </Card>
      )}

      {selectedIdea && (isAnalyzingIdea || analysisResult || analysisError) && (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline text-2xl">Business Analysis for: "{selectedIdea}"</CardTitle>
          </CardHeader>
          <CardContent>
            {isAnalyzingIdea && (
              <div className="flex items-center justify-center p-8 text-muted-foreground">
                <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                Loading analysis...
              </div>
            )}
            {analysisError && (
              <div className="text-destructive p-4 border border-destructive/50 rounded-md bg-destructive/10">
                <p className="flex items-center font-semibold">
                    <AlertTriangle className="mr-2 h-5 w-5" /> Error Analyzing Idea
                </p>
                <p className="mt-1 text-sm">{analysisError}</p>
              </div>
            )}
            {analysisResult && (
              <div className="space-y-4">
                <div className="prose dark:prose-invert max-w-none bg-card p-4 rounded-md border">
                  <pre className="whitespace-pre-wrap break-words font-body text-sm bg-transparent border-0 p-0">
                    {analysisResult}
                  </pre>
                </div>
                
                {!targetAudience && !isGeneratingOutline && (
                  <div className="flex justify-center">
                    <Button onClick={handleGenerateProjectOutline} className="bg-primary hover:bg-primary/90">
                      <Code className="mr-2 h-4 w-4" />
                      Generate Project Outline
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Target Audience & Project Outline Section */}
      {(isGeneratingOutline || targetAudience || outlineError) && (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline text-2xl flex items-center">
              <Users className="mr-2 h-6 w-6 text-primary" />
              Project Development Plan
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
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

            {targetAudience && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2 flex items-center">
                    <Users className="mr-2 h-5 w-5" />
                    Target Audience
                  </h3>
                  <div className="bg-muted p-4 rounded-md">
                    <pre className="whitespace-pre-wrap break-words text-sm">{targetAudience}</pre>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold flex items-center">
                      <Code className="mr-2 h-5 w-5" />
                      Replit Project Outline
                    </h3>
                    <div className="flex items-center gap-2">
                      {!isOutlineApproved && (
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
                      {isOutlineApproved && (
                        <Badge variant="default" className="bg-green-500">
                          <Check className="mr-1 h-3 w-3" />
                          Approved
                        </Badge>
                      )}
                    </div>
                  </div>

                  {isEditingOutline ? (
                    <div className="space-y-3">
                      <Textarea
                        value={editableOutline}
                        onChange={(e) => setEditableOutline(e.target.value)}
                        className="min-h-[400px] font-mono text-sm"
                        placeholder="Edit your project outline..."
                      />
                      <div className="flex gap-2">
                        <Button onClick={handleSaveOutlineEdit} size="sm">
                          <Check className="mr-1 h-3 w-3" />
                          Save Changes
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
                    <div className="bg-card p-4 rounded-md border">
                      <pre className="whitespace-pre-wrap break-words text-sm">{projectOutline}</pre>
                    </div>
                  )}

                  {!isOutlineApproved && !isEditingOutline && projectOutline && (
                    <div className="flex justify-center pt-4">
                      <Button 
                        onClick={handleApproveOutline}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Check className="mr-2 h-4 w-4" />
                        Approve & Save Project Plan
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}