import { OnboardingPageGuard } from "@/components/providers/route-guards";

export default function SetupLayout({ children }: { children: React.ReactNode }) {
  return <OnboardingPageGuard>{children}</OnboardingPageGuard>;
}
