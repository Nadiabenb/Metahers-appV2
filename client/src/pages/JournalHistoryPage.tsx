import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Calendar, Search, Filter, Sparkles, TrendingUp, Tag } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format, parseISO } from "date-fns";
import { AchievementsBadges } from "@/components/AchievementsBadges";

const MOOD_OPTIONS = [
  { value: "all", label: "All Moods" },
  { value: "joyful", label: "Joyful", color: "text-pink-500" },
  { value: "peaceful", label: "Peaceful", color: "text-blue-500" },
  { value: "reflective", label: "Reflective", color: "text-purple-500" },
  { value: "challenged", label: "Challenged", color: "text-amber-500" },
  { value: "energized", label: "Energized", color: "text-gold" },
];

interface JournalEntry {
  id: string;
  content: string;
  mood: string | null;
  tags: string[];
  wordCount: number;
  aiInsights: any;
  createdAt: string;
  lastSaved: string;
}

interface JournalStats {
  totalEntries: number;
  totalWords: number;
  currentStreak: number;
  moodDistribution: Record<string, number>;
  allTags: string[];
  entries: Array<{
    id: string;
    createdAt: string;
    mood: string | null;
    tags: string[];
    wordCount: number;
    content: string;
  }>;
}

export default function JournalHistoryPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMood, setSelectedMood] = useState<string>("all");
  const [selectedTag, setSelectedTag] = useState<string>("all");

  // Fetch journal stats and entries
  const { data: stats, isLoading } = useQuery<JournalStats>({
    queryKey: ['/api/journal/stats'],
  });

  // Filter entries based on search, mood, and tags
  const filteredEntries = stats?.entries.filter(entry => {
    const matchesSearch = searchTerm === "" || 
      entry.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMood = selectedMood === "all" || entry.mood === selectedMood;
    const matchesTag = selectedTag === "all" || 
      (entry.tags && entry.tags.includes(selectedTag));
    
    return matchesSearch && matchesMood && matchesTag;
  }) || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <Sparkles className="w-8 h-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading your journal history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Header with Stats */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-4xl mb-2">Journal History</h1>
            <p className="text-muted-foreground">
              Explore your reflections and track your growth
            </p>
          </div>
        </div>

        {/* Key Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card data-testid="card-stat-entries">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Entries</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="text-total-entries">
                {stats?.totalEntries || 0}
              </div>
            </CardContent>
          </Card>

          <Card data-testid="card-stat-words">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Words</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="text-total-words">
                {stats?.totalWords.toLocaleString() || 0}
              </div>
            </CardContent>
          </Card>

          <Card data-testid="card-stat-streak">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
              <Sparkles className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="text-current-streak">
                {stats?.currentStreak || 0} days
              </div>
            </CardContent>
          </Card>

          <Card data-testid="card-stat-tags">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Unique Tags</CardTitle>
              <Tag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="text-unique-tags">
                {stats?.allTags.length || 0}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Achievements */}
      <AchievementsBadges />

      {/* Analytics Row: Mood Distribution + Tag Cloud */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Mood Distribution */}
        {stats && stats.moodDistribution && Object.keys(stats.moodDistribution).length > 0 && (
          <Card data-testid="card-mood-distribution">
            <CardHeader>
              <CardTitle>Mood Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {Object.entries(stats.moodDistribution).map(([mood, count]) => {
                  const moodOption = MOOD_OPTIONS.find(m => m.value === mood);
                  const percentage = ((count / stats.totalEntries) * 100).toFixed(0);
                  return (
                    <div key={mood} className="flex items-center gap-3">
                      <div className="w-24 capitalize text-sm">
                        <span className={moodOption?.color || ""}>
                          {moodOption?.label || mood}
                        </span>
                      </div>
                      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${moodOption?.color?.replace('text-', 'bg-') || 'bg-primary'}`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <div className="w-16 text-right text-sm text-muted-foreground">
                        {count} ({percentage}%)
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tag Cloud */}
        {stats && stats.allTags && stats.allTags.length > 0 && (
          <Card data-testid="card-tag-cloud">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Tag className="w-5 h-5" />
                Tag Cloud
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {(() => {
                  // Calculate tag frequencies from entries
                  const tagFrequencies: Record<string, number> = {};
                  stats.entries.forEach(entry => {
                    if (entry.tags && Array.isArray(entry.tags)) {
                      entry.tags.forEach(tag => {
                        tagFrequencies[tag] = (tagFrequencies[tag] || 0) + 1;
                      });
                    }
                  });
                  
                  // Sort tags by frequency (descending) and take top 20
                  const sortedTags = stats.allTags
                    .map(tag => ({ tag, count: tagFrequencies[tag] || 0 }))
                    .sort((a, b) => b.count - a.count)
                    .slice(0, 20);
                  
                  const maxCount = Math.max(...sortedTags.map(t => t.count), 1);
                  
                  return sortedTags.map(({ tag, count }) => {
                    // Calculate size based on frequency (1-5 range)
                    const normalizedSize = Math.ceil((count / maxCount) * 4) + 1;
                    const sizes = ['text-xs', 'text-sm', 'text-base', 'text-lg', 'text-xl'];
                    const sizeClass = sizes[Math.min(normalizedSize - 1, 4)];
                    
                    return (
                      <button
                        key={tag}
                        onClick={() => setSelectedTag(tag)}
                        className={`${sizeClass} hover-elevate px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary font-medium transition-all cursor-pointer`}
                        title={`${tag} (used ${count} times)`}
                        data-testid={`tag-cloud-${tag}`}
                      >
                        {tag}
                      </button>
                    );
                  });
                })()}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Writing Calendar */}
      {stats && stats.entries && stats.entries.length > 0 && (
        <Card data-testid="card-writing-calendar">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Writing Calendar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-2">
              {/* Calendar header */}
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div key={day} className="text-center text-xs font-medium text-muted-foreground py-2">
                  {day}
                </div>
              ))}
              
              {/* Calendar days - last 28 days */}
              {Array.from({ length: 28 }).map((_, idx) => {
                const date = new Date();
                date.setDate(date.getDate() - (27 - idx));
                const dateStr = format(date, 'yyyy-MM-dd');
                
                // Find entry for this date
                const entry = stats.entries.find(e => {
                  const entryDate = format(parseISO(e.createdAt), 'yyyy-MM-dd');
                  return entryDate === dateStr;
                });
                
                // Map mood to background color
                const getMoodBg = (mood: string | null | undefined) => {
                  if (!mood) return 'bg-muted/30 border-muted';
                  switch (mood) {
                    case 'joyful': return 'bg-pink-500/30 border-pink-500/60 text-pink-900 dark:text-pink-100';
                    case 'peaceful': return 'bg-blue-500/30 border-blue-500/60 text-blue-900 dark:text-blue-100';
                    case 'reflective': return 'bg-purple-500/30 border-purple-500/60 text-purple-900 dark:text-purple-100';
                    case 'challenged': return 'bg-amber-500/30 border-amber-500/60 text-amber-900 dark:text-amber-100';
                    case 'energized': return 'bg-yellow-500/30 border-yellow-500/60 text-yellow-900 dark:text-yellow-100';
                    default: return 'bg-primary/20 border-primary/40';
                  }
                };
                
                return (
                  <div
                    key={dateStr}
                    className={`
                      aspect-square rounded-md flex items-center justify-center text-xs font-medium
                      transition-all hover-elevate border
                      ${entry 
                        ? getMoodBg(entry.mood) + ' cursor-pointer'
                        : 'bg-muted/30 border-muted text-muted-foreground'
                      }
                    `}
                    title={entry ? `${format(date, 'MMM d')}: ${entry.wordCount} words (${entry.mood || 'no mood'})` : format(date, 'MMM d')}
                    data-testid={`calendar-day-${dateStr}`}
                  >
                    {format(date, 'd')}
                  </div>
                );
              })}
            </div>
            <div className="mt-4 text-xs text-muted-foreground text-center">
              Showing last 28 days • Colored days indicate journal entries
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search and Filters */}
      <Card data-testid="card-filters">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search your entries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                data-testid="input-search"
              />
            </div>
            <Select value={selectedMood} onValueChange={setSelectedMood}>
              <SelectTrigger className="w-full md:w-48" data-testid="select-mood-filter">
                <SelectValue placeholder="Filter by mood" />
              </SelectTrigger>
              <SelectContent>
                {MOOD_OPTIONS.map((mood) => (
                  <SelectItem key={mood.value} value={mood.value}>
                    {mood.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedTag} onValueChange={setSelectedTag}>
              <SelectTrigger className="w-full md:w-48" data-testid="select-tag-filter">
                <SelectValue placeholder="Filter by tag" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tags</SelectItem>
                {stats?.allTags.map((tag) => (
                  <SelectItem key={tag} value={tag}>
                    {tag}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Entry Cards */}
      <div className="space-y-4">
        <h2 className="text-2xl font-display">
          {filteredEntries.length} {filteredEntries.length === 1 ? 'Entry' : 'Entries'}
        </h2>
        
        {filteredEntries.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Filter className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No entries found</h3>
              <p className="text-muted-foreground">
                Try adjusting your filters or search term
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {filteredEntries.map((entry) => {
              const moodOption = MOOD_OPTIONS.find(m => m.value === entry.mood);
              return (
                <Card key={entry.id} className="hover-elevate" data-testid={`card-entry-${entry.id}`}>
                  <CardHeader className="flex flex-row items-start justify-between space-y-0 gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm text-muted-foreground" data-testid={`text-date-${entry.id}`}>
                          {format(parseISO(entry.createdAt), 'MMMM d, yyyy')}
                        </span>
                        {entry.mood && (
                          <Badge variant="secondary" className={moodOption?.color || ""} data-testid={`badge-mood-${entry.id}`}>
                            {moodOption?.label || entry.mood}
                          </Badge>
                        )}
                      </div>
                      {entry.tags && entry.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-2">
                          {entry.tags.map((tag, idx) => (
                            <Badge key={idx} variant="outline" data-testid={`badge-tag-${entry.id}-${idx}`}>
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground whitespace-nowrap" data-testid={`text-wordcount-${entry.id}`}>
                      {entry.wordCount} words
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm line-clamp-3" data-testid={`text-preview-${entry.id}`}>
                      {entry.content}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
