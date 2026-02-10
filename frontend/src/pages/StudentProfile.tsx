import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Shield, ArrowLeft, Save, User, Mail, Phone, GraduationCap, BookOpen, Calendar, Code, Linkedin, Github, Pencil, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { profileAPI, type StudentProfile as ProfileType } from "@/lib/api";
import { toast } from "@/hooks/use-toast";

const StudentProfile = () => {
    const [profile, setProfile] = useState<ProfileType>(profileAPI.getProfile());
    const [editing, setEditing] = useState(false);
    const [draft, setDraft] = useState<ProfileType>(profile);
    const [newSkill, setNewSkill] = useState("");

    useEffect(() => {
        setProfile(profileAPI.getProfile());
    }, []);

    const handleSave = () => {
        const updated = profileAPI.updateProfile(draft);
        setProfile(updated);
        setEditing(false);
        toast({ title: "Profile updated", description: "Your changes have been saved." });
    };

    const handleCancel = () => {
        setDraft(profile);
        setEditing(false);
    };

    const addSkill = () => {
        const skill = newSkill.trim();
        if (skill && !draft.skills.includes(skill)) {
            setDraft({ ...draft, skills: [...draft.skills, skill] });
            setNewSkill("");
        }
    };

    const removeSkill = (skill: string) => {
        setDraft({ ...draft, skills: draft.skills.filter(s => s !== skill) });
    };

    const initials = profile.name.split(" ").map(n => n[0]).join("").toUpperCase();

    return (
        <div className="min-h-screen bg-background">
            <header className="bg-card border-b border-border sticky top-0 z-40">
                <div className="container mx-auto px-4 h-14 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Shield className="h-6 w-6 text-primary" />
                        <span className="font-display text-lg font-bold text-foreground">JOBNEXIS</span>
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                        <Link to="/student"><ArrowLeft className="h-4 w-4 mr-1" /> Back to Jobs</Link>
                    </Button>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8 max-w-3xl">
                {/* Profile Header */}
                <div className="bg-card rounded-2xl border border-border overflow-hidden mb-6">
                    <div className="bg-hero-gradient h-28" />
                    <div className="px-6 pb-6 -mt-12">
                        <div className="flex items-end justify-between">
                            <div className="flex items-end gap-4">
                                <div className="h-20 w-20 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground font-display text-2xl font-bold border-4 border-card shadow-card">
                                    {initials}
                                </div>
                                <div className="pb-1">
                                    <h1 className="font-display text-xl font-bold text-foreground">{profile.name}</h1>
                                    <p className="text-sm text-muted-foreground">{profile.degree} • {profile.college}</p>
                                </div>
                            </div>
                            {!editing && (
                                <Button variant="outline" size="sm" onClick={() => { setDraft(profile); setEditing(true); }}>
                                    <Pencil className="h-4 w-4 mr-1" /> Edit Profile
                                </Button>
                            )}
                        </div>
                    </div>
                </div>

                {editing ? (
                    <div className="space-y-6">
                        <div className="bg-card rounded-xl border border-border p-6 space-y-4">
                            <h2 className="font-display text-lg font-bold text-foreground">Personal Information</h2>
                            <div className="grid sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Full Name</Label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input id="name" className="pl-10" value={draft.name} onChange={e => setDraft({ ...draft, name: e.target.value })} />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input id="email" type="email" className="pl-10" value={draft.email} onChange={e => setDraft({ ...draft, email: e.target.value })} />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone</Label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input id="phone" className="pl-10" value={draft.phone} onChange={e => setDraft({ ...draft, phone: e.target.value })} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-card rounded-xl border border-border p-6 space-y-4">
                            <h2 className="font-display text-lg font-bold text-foreground">Education</h2>
                            <div className="grid sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="college">College</Label>
                                    <div className="relative">
                                        <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input id="college" className="pl-10" value={draft.college} onChange={e => setDraft({ ...draft, college: e.target.value })} />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="degree">Degree</Label>
                                    <div className="relative">
                                        <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input id="degree" className="pl-10" value={draft.degree} onChange={e => setDraft({ ...draft, degree: e.target.value })} />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="gradYear">Graduation Year</Label>
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input id="gradYear" className="pl-10" value={draft.graduationYear} onChange={e => setDraft({ ...draft, graduationYear: e.target.value })} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-card rounded-xl border border-border p-6 space-y-4">
                            <h2 className="font-display text-lg font-bold text-foreground">About & Skills</h2>
                            <div className="space-y-2">
                                <Label htmlFor="bio">Bio</Label>
                                <Textarea id="bio" rows={3} value={draft.bio} onChange={e => setDraft({ ...draft, bio: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <Label>Skills</Label>
                                <div className="flex flex-wrap gap-2 mb-2">
                                    {draft.skills.map(skill => (
                                        <span key={skill} className="inline-flex items-center gap-1 bg-accent/10 text-primary px-2.5 py-1 rounded-full text-xs font-medium">
                                            {skill}
                                            <button onClick={() => removeSkill(skill)} className="hover:text-destructive">
                                                <X className="h-3 w-3" />
                                            </button>
                                        </span>
                                    ))}
                                </div>
                                <div className="flex gap-2">
                                    <Input placeholder="Add a skill..." value={newSkill} onChange={e => setNewSkill(e.target.value)} onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addSkill())} />
                                    <Button variant="outline" type="button" onClick={addSkill}>Add</Button>
                                </div>
                            </div>
                        </div>

                        <div className="bg-card rounded-xl border border-border p-6 space-y-4">
                            <h2 className="font-display text-lg font-bold text-foreground">Social Links</h2>
                            <div className="grid sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="linkedin">LinkedIn</Label>
                                    <div className="relative">
                                        <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input id="linkedin" className="pl-10" value={draft.linkedin} onChange={e => setDraft({ ...draft, linkedin: e.target.value })} />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="github">GitHub</Label>
                                    <div className="relative">
                                        <Github className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input id="github" className="pl-10" value={draft.github} onChange={e => setDraft({ ...draft, github: e.target.value })} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3 justify-end">
                            <Button variant="outline" onClick={handleCancel}>Cancel</Button>
                            <Button onClick={handleSave}><Save className="h-4 w-4 mr-1" /> Save Changes</Button>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div className="bg-card rounded-xl border border-border p-6 space-y-3">
                            <h2 className="font-display text-lg font-bold text-foreground">About</h2>
                            <p className="text-sm text-muted-foreground leading-relaxed">{profile.bio || "No bio added yet."}</p>
                        </div>

                        <div className="bg-card rounded-xl border border-border p-6 space-y-3">
                            <h2 className="font-display text-lg font-bold text-foreground">Details</h2>
                            <div className="grid sm:grid-cols-2 gap-3 text-sm">
                                <div className="flex items-center gap-2 text-muted-foreground"><Mail className="h-4 w-4" /> {profile.email}</div>
                                <div className="flex items-center gap-2 text-muted-foreground"><Phone className="h-4 w-4" /> {profile.phone}</div>
                                <div className="flex items-center gap-2 text-muted-foreground"><GraduationCap className="h-4 w-4" /> {profile.college}</div>
                                <div className="flex items-center gap-2 text-muted-foreground"><BookOpen className="h-4 w-4" /> {profile.degree}</div>
                                <div className="flex items-center gap-2 text-muted-foreground"><Calendar className="h-4 w-4" /> Class of {profile.graduationYear}</div>
                            </div>
                        </div>

                        <div className="bg-card rounded-xl border border-border p-6 space-y-3">
                            <h2 className="font-display text-lg font-bold text-foreground flex items-center gap-2"><Code className="h-5 w-5" /> Skills</h2>
                            <div className="flex flex-wrap gap-2">
                                {profile.skills.length > 0 ? profile.skills.map(skill => (
                                    <span key={skill} className="bg-accent/10 text-primary px-3 py-1 rounded-full text-xs font-medium">
                                        {skill}
                                    </span>
                                )) : <p className="text-sm text-muted-foreground">No skills added yet.</p>}
                            </div>
                        </div>

                        <div className="bg-card rounded-xl border border-border p-6 space-y-3">
                            <h2 className="font-display text-lg font-bold text-foreground">Social Links</h2>
                            <div className="flex gap-3">
                                {profile.linkedin && (
                                    <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline">
                                        <Linkedin className="h-4 w-4" /> LinkedIn
                                    </a>
                                )}
                                {profile.github && (
                                    <a href={profile.github} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline">
                                        <Github className="h-4 w-4" /> GitHub
                                    </a>
                                )}
                                {!profile.linkedin && !profile.github && <p className="text-sm text-muted-foreground">No links added yet.</p>}
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default StudentProfile;
