"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import {
  Check,
  Copy,
  Moon,
  Sun,
  Laptop,
  ArrowRight,
  Globe,
  Lock,
  Sparkles,
  Rocket,
  LucideChevronLeft,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AVAILABLE_TAGS } from "@/lib/Static-items";
import { Id } from "../../../../convex/_generated/dataModel";
import Image from "next/image";

const OnboardPage = () => {
  const { userId } = useParams();
  const router = useRouter();
  const { setTheme: setSystemTheme } = useTheme();

  // Mutations
  const updateUserTheme = useMutation(api.users.updateUserTheme);
  const createProject = useMutation(api.projects.createProject);
  const completeOnboarding = useMutation(api.users.completeOnboarding);

  // State
  const [step, setStep] = useState(1);
  const [selectedTheme, setSelectedTheme] = useState<
    "light" | "dark" | "system"
  >("system");
  const [projectName, setProjectName] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isPublic, setIsPublic] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  // Step 3 State
  const [inviteLink, setInviteLink] = useState("");
  const [projectId, setProjectId] = useState<Id<"projects"> | null>(null);

  // Step 1: Theme Selection
  const handleThemeSelect = async (theme: "light" | "dark" | "system") => {
    setSelectedTheme(theme);
    setSystemTheme(theme);
    try {
      if (userId) {
        await updateUserTheme({
          theme,
          userId: userId as Id<"users">,
        });
        toast.success("Theme updated!");
        setTimeout(() => setStep(2), 500);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update theme");
    }
  };

  // Step 2: Project Creation
  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      if (selectedTags.length >= 5) {
        toast.error("Max 5 tags allowed");
        return;
      }
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleCreateProject = async () => {
    if (!projectName.trim()) {
      toast.error("Project name is required");
      return;
    }
    if (selectedTags.length < 2) {
      toast.error("Please select at least 2 tags");
      return;
    }

    setIsCreating(true);
    try {
      const result = await createProject({
        name: projectName,
        tags: selectedTags,
        isPublic: isPublic,
        ownerId: userId as Id<"users">,
      });

      setProjectId(result.projectId);
      setInviteLink(result.inviteLink);
      setStep(3);
      toast.success("Project created successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to create project");
    } finally {
      setIsCreating(false);
    }
  };

  // Step 3: Complete
  const copyToClipboard = () => {
    navigator.clipboard.writeText(inviteLink);
    toast.success("Link copied to clipboard");
  };

  const handleComplete = async () => {
    try {
      await completeOnboarding({ userId: userId as Id<"users"> });
      router.push("/dashboard");
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      <div className="absolute top-4 left-4 flex items-center gap-3">
        <Image src="/logo.svg" alt="Logo" width={40} height={40} className="" />
        <h1 className="font-pop font-bold text-2xl">Looma</h1>
      </div>

      {/* Images / Illustrations */}
      <div className="">
        <Image
          src="/9.png"
          alt="image"
          width={200}
          height={200}
          className="absolute bottom-10 left-0"
        />
        <Image
          src="/10.png"
          alt="image"
          width={200}
          height={200}
          className="absolute bottom-0 left-30"
        />
        <Image
          src="/11.png"
          alt="image"
          width={200}
          height={200}
          className="absolute bottom-0 right-30"
        />
        <Image
          src="/8.png"
          alt="image"
          width={200}
          height={200}
          className="absolute bottom-20 right-10"
        />
        <Image
          src="/12.png"
          alt="image"
          width={200}
          height={200}
          className="absolute bottom-40 left-10 rotate-45 scale-90"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl z-50"
      >
        <div className="mb-8 text-center">
          <motion.h1
            key={step}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-semibold font-sans tracking-tight mb-2"
          >
            {step === 1 && "Choose your Aesthetic"}
            {step === 2 && "Create your first Workspace"}
            {step === 3 && "You're all set!"}
          </motion.h1>
          <p className="text-muted-foreground font-sans">Step {step} of 3</p>
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              {[
                { id: "light", icon: Sun, label: "Light Mode" },
                { id: "dark", icon: Moon, label: "Dark Mode" },
                { id: "system", icon: Laptop, label: "System Default" },
              ].map((theme) => (
                <Card
                  key={theme.id}
                  onClick={() => handleThemeSelect(theme.id as any)}
                  className={`cursor-pointer hover:border-primary transition-all duration-300 hover:scale-105 group relative overflow-hidden ${
                    selectedTheme === theme.id
                      ? "border-primary ring-2 ring-primary/20"
                      : ""
                  }`}
                >
                  <CardContent className="flex flex-col items-center justify-center p-4 gap-4">
                    <div className="p-3 rounded-full bg-muted group-hover:bg-primary/10 transition-colors">
                      <theme.icon className="w-6 h-6 group-hover:text-primary transition-colors" />
                    </div>
                    <span className="font-medium text-sm text-muted-foreground">{theme.label}</span>
                    {selectedTheme === theme.id && (
                      <motion.div
                        layoutId="check"
                        className="absolute top-4 right-4 text-primary"
                      >
                        <Check className="w-5 h-5" />
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-card border rounded-2xl p-8 shadow-sm space-y-8"
            >
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-lg">
                    Project Name
                  </Label>
                  <Input
                    id="name"
                    placeholder="My Awesome Project"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    className="text-lg h-12"
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <Label className="text-lg">Select Tags</Label>
                    <span
                      className={`text-sm ${
                        selectedTags.length < 2
                          ? "text-destructive"
                          : "text-muted-foreground"
                      }`}
                    >
                      {selectedTags.length}/5 (Min 2)
                    </span>
                  </div>
                  <ScrollArea className="h-[200px] rounded-md border p-4">
                    <div className="flex flex-wrap gap-2">
                      {AVAILABLE_TAGS.map((tag) => (
                        <Badge
                          key={tag}
                          variant={
                            selectedTags.includes(tag) ? "default" : "outline"
                          }
                          className="cursor-pointer text-sm py-1.5 px-3 hover:translate-y-[-2px] transition-transform"
                          onClick={() => toggleTag(tag)}
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </ScrollArea>
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg border bg-muted/30">
                  <div className="space-y-0.5">
                    <Label className="text-base">Visibility</Label>
                    <div className="text-sm text-muted-foreground flex items-center gap-2">
                      {isPublic ? (
                        <Globe className="w-4 h-4" />
                      ) : (
                        <Lock className="w-4 h-4" />
                      )}
                      {isPublic ? "Public to everyone" : "Private workspace"}
                    </div>
                  </div>
                  <Switch checked={isPublic} onCheckedChange={setIsPublic} />
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <Button
                  size="sm"
                  className="px-6! text-xs"
                  onClick={handleBack}
                >
                  <LucideChevronLeft className="w-5 h-5" /> Back
                </Button>
                <Button
                  size="sm"
                  onClick={handleCreateProject}
                  disabled={isCreating}
                  className="w-full md:w-auto text-xs px-6! gap-2"
                >
                  {isCreating ? (
                    "Creating..."
                  ) : (
                    <>
                      Create Project <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-card border rounded-2xl p-8 shadow-sm text-center"
            >
              <div className="mb-8 flex justify-center">
                <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center text-green-500">
                  <Sparkles className="w-10 h-10" />
                </div>
              </div>

              <h2 className="text-2xl font-semibold mb-4">
                You're ready to go!
              </h2>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                Your workspace{" "}
                <span className="font-semibold text-foreground">
                  "{projectName}"
                </span>{" "}
                has been created. Invite your team to collaborate.
              </p>

              <div className="max-w-md mx-auto mb-8 p-1 rounded-lg border flex items-center gap-2 bg-muted/50">
                <div className="flex-1 px-3 text-sm text-muted-foreground truncate font-mono">
                  {inviteLink}
                </div>
                <Button variant="ghost" size="icon" onClick={copyToClipboard}>
                  <Copy className="w-4 h-4" />
                </Button>
              </div>

              <Button
                size="lg"
                onClick={handleComplete}
                className="w-full md:w-auto text-lg px-12 gap-2 bg-green-600 hover:bg-green-700 text-white"
              >
                Let's Start <Rocket className="w-5 h-5" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default OnboardPage;
