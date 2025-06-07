
"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from "@/components/ui/input";
import { Search, Code, Calendar, Trash2, Check, Users } from "lucide-react";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';

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

export default function ProjectOutlinesPage() {
  const [analyses, setAnalyses] = useState<SavedAnalysis[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOutline, setSelectedOutline] = useState<SavedAnalysis | null>(null);

  useEffect(() => {
    // Load saved analyses from localStorage and filter for those with outlines
    const savedAnalyses = localStorage.getItem('savedAnalyses');
    if (savedAnalyses) {
      const allAnalyses = JSON.parse(savedAnalyses);
      const withOutlines = allAnalyses.filter((analysis: SavedAnalysis) => analysis.projectOutline);
      setAnalyses(withOutlines);
    }
  }, []);

  const filteredOutlines = analyses.filter(analysis =>
    analysis.trendName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (analysis.keyword && analysis.keyword.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const deleteOutline = (id: string) => {
    // Remove outline from the analysis but keep the analysis itself
    const allSavedAnalyses = JSON.parse(localStorage.getItem('savedAnalyses') || '[]');
    const updatedAnalyses = allSavedAnalyses.map((analysis: SavedAnalysis) => 
      analysis.id === id 
        ? { ...analysis, projectOutline: null, targetAudience: null, isOutlineApproved: false }
        : analysis
    );
    localStorage.setItem('savedAnalyses', JSON.stringify(updatedAnalyses));
    
    // Update local state
    setAnalyses(prev => prev.filter(analysis => analysis.id !== id));
    if (selectedOutline?.id === id) {
      setSelectedOutline(null);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="font-headline text-3xl font-bold text-foreground flex items-center gap-2">
            <Code className="h-8 w-8 text-green-500" />
            Project Outlines
          </h1>
          <p className="text-muted-foreground mt-2">
            View and manage your approved project development plans
          </p>
        </div>
        <div className="relative w-full sm:w-auto sm:max-w-xs">
          <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search outlines..."
            className="w-full rounded-lg bg-background pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {analyses.length === 0 ? (
        <div className="text-center py-12">
          <Code className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <p className="text-xl text-muted-foreground">No project outlines yet.</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Go to the <a href="/analyzed-ideas" className="text-blue-500 hover:underline">Analyzed Ideas</a> page to generate project outlines.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left side - List of project outlines */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Your Project Outlines ({filteredOutlines.length})</h2>
            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {filteredOutlines.map((analysis) => (
                <Card 
                  key={analysis.id} 
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedOutline?.id === analysis.id ? 'ring-2 ring-green-500' : ''
                  }`}
                  onClick={() => setSelectedOutline(analysis)}
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
                          {analysis.isOutlineApproved ? (
                            <Badge variant="default" className="text-xs bg-green-500">
                              <Check className="h-2 w-2 mr-1" />
                              Approved
                            </Badge>
                          ) : (
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
                          deleteOutline(analysis.id);
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

          {/* Right side - Selected outline details */}
          <div>
            {selectedOutline ? (
              <Card className="h-fit">
                <CardHeader>
                  <CardTitle className="text-lg">{selectedOutline.trendName}</CardTitle>
                  <CardDescription className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Created {formatDistanceToNow(new Date(selectedOutline.createdAt), { addSuffix: true })}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {selectedOutline.targetAudience && (
                    <div>
                      <h3 className="font-semibold text-base mb-2 flex items-center">
                        <Users className="h-4 w-4 mr-2" />
                        Target Audience
                      </h3>
                      <div className="bg-muted p-3 rounded-md">
                        <pre className="whitespace-pre-wrap break-words text-sm">{selectedOutline.targetAudience}</pre>
                      </div>
                    </div>
                  )}

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-base flex items-center">
                        <Code className="h-4 w-4 mr-2" />
                        Project Outline
                      </h3>
                      {selectedOutline.isOutlineApproved && (
                        <Badge variant="default" className="bg-green-500">
                          <Check className="h-3 w-3 mr-1" />
                          Approved
                        </Badge>
                      )}
                    </div>
                    <div className="bg-card p-3 rounded-md border">
                      <pre className="whitespace-pre-wrap break-words text-sm">{selectedOutline.projectOutline}</pre>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="h-64 flex items-center justify-center">
                <CardContent className="text-center">
                  <p className="text-muted-foreground">Select a project outline to view details</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
