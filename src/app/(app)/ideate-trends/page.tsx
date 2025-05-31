
"use client";

import { useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Lightbulb, Zap, Loader2, AlertTriangle, Sparkles, Search } from 'lucide-react';
import { generatePotentialTrends, type GeneratePotentialTrendsOutput } from '@/ai/flows/generate-potential-trends-flow';
import { analyzePotentialTrend, type AnalyzePotentialTrendOutput } from '@/ai/flows/analyze-potential-trend-flow';
import { useToast } from "@/hooks/use-toast";

export default function IdeateTrendsPage() {
  const [topicKeyword, setTopicKeyword] = useState<string>('');
  const [potentialTrends, setPotentialTrends] = useState<string[]>([]);
  const [selectedTrend, setSelectedTrend] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  
  const [isGeneratingIdeas, setIsGeneratingIdeas] = useState<boolean>(false);
  const [isAnalyzingTrend, setIsAnalyzingTrend] = useState<boolean>(false);
  
  const [ideasError, setIdeasError] = useState<string | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  const { toast } = useToast();

  const handleGenerateIdeas = async (e: FormEvent) => {
    e.preventDefault();
    if (!topicKeyword.trim() || topicKeyword.trim().length < 3) {
      setIdeasError("Please enter a topic keyword (minimum 3 characters).");
      toast({
        title: "Input Error",
        description: "Topic keyword must be at least 3 characters long.",
        variant: "destructive",
      });
      return;
    }

    setIsGeneratingIdeas(true);
    setPotentialTrends([]);
    setSelectedTrend(null);
    setAnalysisResult(null);
    setIdeasError(null);
    setAnalysisError(null);

    try {
      const result: GeneratePotentialTrendsOutput = await generatePotentialTrends({ topicKeyword });
      if (result.potentialTrends && result.potentialTrends.length > 0) {
        setPotentialTrends(result.potentialTrends);
        toast({
          title: "Ideas Generated!",
          description: "Select an idea below to analyze it further.",
        });
      } else {
        setIdeasError("No potential trends were generated. Try a different keyword.");
         toast({
          title: "No Ideas Found",
          description: "The AI couldn't generate ideas for this topic. Try refining your keyword.",
          variant: "default",
        });
      }
    } catch (error) {
      console.error("Error generating potential trends:", error);
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
      setIdeasError(`Failed to generate ideas: ${errorMessage}`);
      toast({
        title: "Generation Failed",
        description: `Could not generate potential trends: ${errorMessage}`,
        variant: "destructive",
      });
    } finally {
      setIsGeneratingIdeas(false);
    }
  };

  const handleAnalyzeTrend = async (trendName: string) => {
    setSelectedTrend(trendName);
    setIsAnalyzingTrend(true);
    setAnalysisResult(null);
    setAnalysisError(null);

    try {
      const result: AnalyzePotentialTrendOutput = await analyzePotentialTrend({ trendName });
      setAnalysisResult(result.analysisMarkdown);
      toast({
        title: "Analysis Complete",
        description: `Showing analysis for "${trendName}".`,
      });
    } catch (error) {
      console.error("Error analyzing potential trend:", error);
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
      setAnalysisError(`Failed to analyze trend: ${errorMessage}`);
       toast({
        title: "Analysis Failed",
        description: `Could not analyze the trend "${trendName}": ${errorMessage}`,
        variant: "destructive",
      });
    } finally {
      setIsAnalyzingTrend(false);
    }
  };

  return (
    <div className="container mx-auto space-y-8">
      <h1 className="font-headline text-3xl font-bold my-8 text-foreground">Ideate New Trends</h1>
      
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Search className="mr-2 h-6 w-6 text-primary" />
            Explore a Topic
          </CardTitle>
          <CardDescription>
            Enter a keyword or topic to brainstorm potential new trends.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleGenerateIdeas}>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="topicKeyword" className="font-semibold">Topic / Keyword</Label>
              <Input
                id="topicKeyword"
                type="text"
                value={topicKeyword}
                onChange={(e) => {
                  setTopicKeyword(e.target.value);
                  if (ideasError) setIdeasError(null);
                }}
                placeholder="e.g., Sustainable Technology, Future of Work"
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
                  Generate Potential Trends
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>

      {potentialTrends.length > 0 && (
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center">
                <Sparkles className="mr-2 h-6 w-6 text-primary" />
                Potential Trend Ideas
            </CardTitle>
            <CardDescription>Click on an idea to get a detailed AI analysis.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {potentialTrends.map((trend, index) => (
              <Button
                key={index}
                variant="outline"
                className="justify-start text-left h-auto py-3"
                onClick={() => handleAnalyzeTrend(trend)}
                disabled={isAnalyzingTrend && selectedTrend === trend}
              >
                {isAnalyzingTrend && selectedTrend === trend ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin shrink-0" />
                    Analyzing...
                  </>
                ) : (
                  <>
                   <Zap className="mr-2 h-4 w-4 text-accent shrink-0" />
                   {trend}
                  </>
                )}
              </Button>
            ))}
          </CardContent>
        </Card>
      )}

      {selectedTrend && (isAnalyzingTrend || analysisResult || analysisError) && (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline text-2xl">Analysis for: "{selectedTrend}"</CardTitle>
          </CardHeader>
          <CardContent>
            {isAnalyzingTrend && (
              <div className="flex items-center justify-center p-8 text-muted-foreground">
                <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                Loading analysis...
              </div>
            )}
            {analysisError && (
              <div className="text-destructive p-4 border border-destructive/50 rounded-md bg-destructive/10">
                <p className="flex items-center font-semibold">
                    <AlertTriangle className="mr-2 h-5 w-5" /> Error Analyzing Trend
                </p>
                <p className="mt-1 text-sm">{analysisError}</p>
              </div>
            )}
            {analysisResult && (
              <div className="prose dark:prose-invert max-w-none bg-card p-4 rounded-md border">
                <pre className="whitespace-pre-wrap break-words font-body text-sm bg-transparent border-0 p-0">
                  {analysisResult}
                </pre>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
