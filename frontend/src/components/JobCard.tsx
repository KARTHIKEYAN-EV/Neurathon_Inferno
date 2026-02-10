// frontend/src/components/JobCard.tsx
import { Briefcase, MapPin, IndianRupee, Shield, AlertCircle } from 'lucide-react';
import { Job } from '@/types/job';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface JobCardProps {
    job: Job;
    onViewDetails: () => void;
    onApply?: () => void;
    hasApplied?: boolean;
}

const JobCard = ({ job, onViewDetails, onApply, hasApplied }: JobCardProps) => {
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
        <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-display text-xl font-semibold text-gray-900">{job.title}</h3>
                        {job.isVerified && (
                            <Badge className="bg-green-100 text-green-800 border-green-200">
                                <Shield className="h-3 w-3 mr-1" />
                                Verified
                            </Badge>
                        )}
                    </div>
                    <p className="text-gray-600 font-medium">{job.company}</p>
                </div>
                <Badge className={`${getRiskColor(job.riskLevel)} border`}>
                    {job.riskLevel.charAt(0).toUpperCase() + job.riskLevel.slice(1)} Risk
                </Badge>
            </div>

            <div className="space-y-3 mb-6">
                <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>{job.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <IndianRupee className="h-4 w-4" />
                        <span>{formatSalary(job.salaryMin, job.salaryMax)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Briefcase className="h-4 w-4" />
                        <span className="capitalize">{job.type.replace('-', ' ')}</span>
                    </div>
                </div>

                <p className="text-gray-700 line-clamp-2">{job.description}</p>
            </div>

            <div className="flex justify-between items-center">
                <Button
                    variant="outline"
                    onClick={onViewDetails}
                    className="text-primary border-primary hover:bg-primary/10"
                >
                    View Details
                </Button>

                {onApply && !hasApplied && (
                    <Button onClick={onApply}>
                        Apply Now
                    </Button>
                )}

                {hasApplied && (
                    <Badge className="bg-blue-100 text-blue-800">
                        Applied ✓
                    </Badge>
                )}
            </div>
        </div>
    );
};

export default JobCard;