import { TextMorph } from "@/components/ui/text-morph";

export default function TextMorphDemo() {
  return (
    <div className="flex min-h-[300px] w-full items-center justify-center">
      <p className="flex flex-wrap items-center justify-center gap-2 text-3xl font-semibold tracking-tight sm:text-4xl">
        <span>I am a</span>
        <TextMorph
          words={["engineer", "developer", "designer"]}
          interval={2500}
          className="text-primary"
        />
      </p>
    </div>
  );
}
