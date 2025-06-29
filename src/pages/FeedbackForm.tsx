
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from './../components/ui/button';
import { Input } from './../components/ui/input';
import { Label } from './../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './../components/ui/select';
import { Textarea } from './../components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './../components/ui/form';
import { MessageSquare, Send, MapPin, Phone, AlertCircle, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from './../components/ui/badge';
import { Alert, AlertDescription } from './../components/ui/alert';

const feedbackSchema = z.object({
  age: z.number().min(1, 'Age must be at least 1').max(120, 'Age must be less than 120'),
  sex: z.enum(['male', 'female', 'other'], { required_error: 'Please select gender' }),
  location: z.string().min(2, 'Location must be at least 2 characters').max(100, 'Location is too long'),
  project: z.string().min(1, 'Please select a project'),
  feedbackType: z.enum(['programmatic', 'sensitive', 'out_of_scope'], { required_error: 'Please select feedback type' }),
  details: z.string().min(10, 'Please provide at least 10 characters').max(1000, 'Feedback is too long (max 1000 characters)'),
  channel: z.enum(['email', 'phone', 'in_person'], { required_error: 'Please select contact method' }),
  phone: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high']).default('medium'),
  anonymous: z.boolean().default(false),
}).refine((data) => {
  if (data.channel === 'phone' && (!data.phone || data.phone.length < 10)) {
    return false;
  }
  return true;
}, {
  message: "Phone number is required when phone is selected as contact method",
  path: ["phone"],
});

type FeedbackForm = z.infer<typeof feedbackSchema>;

const mockProjects = [
  { id: '1', name: 'Education Support Program', status: 'active' },
  { id: '2', name: 'Healthcare Initiative', status: 'active' },
  { id: '3', name: 'Water & Sanitation Project', status: 'active' },
  { id: '4', name: 'Women Empowerment Program', status: 'completed' },
  { id: '5', name: 'Youth Skills Development', status: 'active' },
];

export default function FeedbackForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [charCount, setCharCount] = useState(0);

  const form = useForm<FeedbackForm>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      age: undefined,
      sex: undefined,
      location: '',
      project: '',
      feedbackType: undefined,
      details: '',
      channel: undefined,
      phone: '',
      priority: 'medium',
      anonymous: false,
    },
  });

  const watchedChannel = form.watch('channel');
  const watchedDetails = form.watch('details');

  const onSubmit = async (data: FeedbackForm) => {
    setIsSubmitting(true);
    
    try {
      // Simulate API call with better error handling
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          if (Math.random() > 0.1) { // 90% success rate for demo
            resolve(data);
          } else {
            reject(new Error('Submission failed'));
          }
        }, 2000);
      });
      
      console.log('Feedback submitted:', data);
      setSubmitSuccess(true);
      toast.success('Feedback submitted successfully! Reference ID: FB-' + Date.now());
      form.reset();
      setCharCount(0);
      
      // Auto-hide success message after 5 seconds
      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (error) {
      toast.error('Failed to submit feedback. Please try again.');
      console.error('Submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getFeedbackTypeDescription = (type: string) => {
    switch (type) {
      case 'programmatic': return 'General feedback about program activities';
      case 'sensitive': return 'Confidential concerns requiring special handling';
      case 'out_of_scope': return 'Issues outside current program scope';
      default: return '';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center justify-center">
          <MessageSquare className="mr-3 h-8 w-8 text-purple-400" />
          Submit Feedback
        </h1>
        <p className="text-gray-400">Help us improve our services by sharing your experience</p>
      </div>

      {submitSuccess && (
        <Alert className="bg-green-900/20 border-green-500/30">
          <CheckCircle2 className="h-4 w-4 text-green-400" />
          <AlertDescription className="text-green-200">
            Your feedback has been successfully submitted and will be reviewed within 24-48 hours.
          </AlertDescription>
        </Alert>
      )}

      <Card className="bg-black/20 backdrop-blur-xl border-purple-500/20">
        <CardHeader>
          <CardTitle className="text-white">Beneficiary Feedback Form</CardTitle>
          <CardDescription className="text-gray-400">
            Please fill out all required fields to submit your feedback. All information is confidential.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Personal Information Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white border-b border-purple-500/30 pb-2">
                  Personal Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="age"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Age *</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Enter age"
                            className="bg-black/20 border-purple-500/30 text-white placeholder:text-gray-400"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || '')}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="sex"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Gender *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-black/20 border-purple-500/30 text-white">
                              <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-slate-800 border-purple-500/30">
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white flex items-center">
                        <MapPin className="mr-2 h-4 w-4 text-purple-400" />
                        Location *
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your location (city, district)"
                          className="bg-black/20 border-purple-500/30 text-white placeholder:text-gray-400"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Project Information Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white border-b border-purple-500/30 pb-2">
                  Project Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="project"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Project *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-black/20 border-purple-500/30 text-white">
                              <SelectValue placeholder="Select project" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-slate-800 border-purple-500/30">
                            {mockProjects.map((project) => (
                              <SelectItem key={project.id} value={project.id}>
                                <div className="flex items-center gap-2">
                                  {project.name}
                                  <Badge 
                                    variant={project.status === 'active' ? 'default' : 'secondary'}
                                    className="text-xs"
                                  >
                                    {project.status}
                                  </Badge>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="feedbackType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Feedback Type *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-black/20 border-purple-500/30 text-white">
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-slate-800 border-purple-500/30">
                            <SelectItem value="programmatic">
                              <div className="space-y-1">
                                <div>Programmatic</div>
                                <div className="text-xs text-gray-400">General program feedback</div>
                              </div>
                            </SelectItem>
                            <SelectItem value="sensitive">
                              <div className="space-y-1">
                                <div className="flex items-center gap-1">
                                  Sensitive <AlertCircle className="h-3 w-3 text-red-400" />
                                </div>
                                <div className="text-xs text-gray-400">Confidential concerns</div>
                              </div>
                            </SelectItem>
                            <SelectItem value="out_of_scope">
                              <div className="space-y-1">
                                <div>Out of Scope</div>
                                <div className="text-xs text-gray-400">External issues</div>
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="priority"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Priority Level</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-black/20 border-purple-500/30 text-white">
                            <SelectValue placeholder="Select priority" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-slate-800 border-purple-500/30">
                          {['low', 'medium', 'high'].map((priority) => (
                            <SelectItem key={priority} value={priority}>
                              <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${getPriorityColor(priority)}`} />
                                {priority.charAt(0).toUpperCase() + priority.slice(1)}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Feedback Details Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white border-b border-purple-500/30 pb-2">
                  Feedback Details
                </h3>
                <FormField
                  control={form.control}
                  name="details"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Feedback Details *</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Please provide detailed feedback about your experience..."
                          className="bg-black/20 border-purple-500/30 text-white placeholder:text-gray-400 min-h-[120px]"
                          {...field}
                          onChange={(e) => {
                            field.onChange(e);
                            setCharCount(e.target.value.length);
                          }}
                        />
                      </FormControl>
                      <div className="flex justify-between text-sm">
                        <FormMessage />
                        <span className={`${charCount > 1000 ? 'text-red-400' : 'text-gray-400'}`}>
                          {charCount}/1000 characters
                        </span>
                      </div>
                    </FormItem>
                  )}
                />
              </div>

              {/* Contact Preferences Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white border-b border-purple-500/30 pb-2">
                  Contact Preferences
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="channel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Preferred Contact Method *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-black/20 border-purple-500/30 text-white">
                              <SelectValue placeholder="Select method" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-slate-800 border-purple-500/30">
                            <SelectItem value="email">Email</SelectItem>
                            <SelectItem value="phone">Phone</SelectItem>
                            <SelectItem value="in_person">In Person</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white flex items-center">
                          <Phone className="mr-2 h-4 w-4 text-purple-400" />
                          Phone Number {watchedChannel === 'phone' && '*'}
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter phone number"
                            className="bg-black/20 border-purple-500/30 text-white placeholder:text-gray-400"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium py-3 h-12"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Submitting Feedback...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Submit Feedback
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
