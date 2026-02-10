// frontend/src/components/JobDetails.tsx
import { X, Briefcase, MapPin, IndianRupee, Calendar, Shield, AlertCircle, CheckCircle } from 'lucide-react';
import { Job } from '@/types/job';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface JobDetailsProps {
    job: Job | null;
    open: boolean;
    onClose: () => void;
    onApply: (jobId: string) => void;
    hasApplied: boolean;
}

const JobDetails = ({ job, open, onClose, onApply, hasApplied }: JobDetailsProps) => {
    if (!job) return null;

    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    const formatSalary = (min: number, max: number) => {
        return `₹${min.toLocaleString('en-IN')} - ₹${max.toLocaleString('en-IN')}`;
    };

    const getRiskColor = (risk: string) => {
        switch (risk) {
            case 'low': return 'bg-green-100 text-green-800';
            case 'medium': return 'bg-yellow-100 text-yellow-800';
            case 'high': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <span className="font-display text-2xl">{job.title}</span>
                            {job.isVerified && (
                                <Badge className="bg-green-100 text-green-800 border-green-200">
                                    <Shield className="h-3 w-3 mr-1" />
                                    Verified
                                </Badge>
                            )}
                        </div>
                        <Button variant="ghost" size="icon" onClick={onClose}>
                            <X className="h-4 w-4" />
                        </Button>
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Job Header */}
                    <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex flex-wrap gap-4 mb-3">
                            <div className="flex items-center gap-2">
                                <Briefcase className="h-5 w-5 text-gray-500" />
                                <span className="font-medium">{job.company}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <MapPin className="h-5 w-5 text-gray-500" />
                                <span>{job.location}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <IndianRupee className="h-5 w-5 text-gray-500" />
                                <span>{formatSalary(job.salaryMin, job.salaryMax)}</span>
                            </div>
                            <Badge variant="outline" className="capitalize">
                                {job.type.replace('-', ' ')}
                            </Badge>
                            <Badge className={`${getRiskColor(job.riskLevel)} border`}>
                                {job.riskLevel.charAt(0).toUpperCase() + job.riskLevel.slice(1)} Risk
                            </Badge>
                        </div>

                        {job.deadline && (
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Calendar className="h-4 w-4" />
                                <span>Apply before: {formatDate(job.deadline)}</span>
                            </div>
                        )}
                    </div>

                    {/* Risk Assessment */}
                    <div className={`p-4 rounded-lg ${getRiskColor(job.riskLevel)} border`}>
                        <div className="flex items-center gap-2 mb-2">
                            {job.riskLevel === 'low' ? (
                                <CheckCircle className="h-5 w-5" />
                            ) : (
                                <AlertCircle className="h-5 w-5" />
                            )}
                            <h4 className="font-semibold">Safety Assessment: {job.riskLevel.toUpperCase()} RISK</h4>
                        </div>
                        <p className="text-sm">
                            {job.riskLevel === 'low'
                                ? "This job has passed all verification checks. Company details, contact information, and job description have been verified."
                                : job.riskLevel === 'medium'
                                    ? "This job requires additional verification. Some details couldn't be fully verified."
                                    : "Exercise caution. This job listing has unverified elements. Contact company directly for confirmation."
                            }
                        </p>
                    </div>

                    {/* Description */}
                    <div>
                        <h4 className="font-semibold text-lg mb-2">Job Description</h4>
                        <p className="text-gray-700 whitespace-pre-line">{job.description}</p>
                    </div>

                    {/* Requirements */}
                    {job.requirements && job.requirements.length > 0 && (
                        <div>
                            <h4 className="font-semibold text-lg mb-2">Requirements</h4>
                            <ul className="list-disc pl-5 space-y-1 text-gray-700">
                                {job.requirements.map((req, index) => (
                                    <li key={index}>{req}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Posted Info */}
                    <div className="text-sm text-gray-500">
                        <p>Posted by: {job.recruiterName}</p>
                        <p>Posted on: {formatDate(job.postedDate)}</p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4 border-t">
                        <Button variant="outline" onClick={onClose}>
                            Close
                        </Button>

                        {!hasApplied ? (
                            <Button
                                onClick={() => onApply(job.id)}
                                className="flex-1"
                                disabled={job.riskLevel === 'high'}
                            >
                                {job.riskLevel === 'high' ? 'High Risk - Apply with Caution' : 'Apply Now'}
                            </Button>
                        ) : (
                            <Button variant="outline" className="flex-1" disabled>
                                ✓ Already Applied
                            </Button>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default JobDetails;