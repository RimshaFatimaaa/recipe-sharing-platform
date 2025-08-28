"use client";

export function RecipeForm({
  defaultValues,
  action,
  submitText,
}: {
  defaultValues?: Partial<{
    title: string;
    description: string | null;
    cooking_time: number | null;
    difficulty: string | null;
    category: string | null;
    ingredients: string | null;
    instructions: string | null;
  }>;
  action: (formData: FormData) => void;
  submitText: string;
}) {
  return (
    <form className="mt-6 grid grid-cols-1 gap-4" action={action}>
      <div>
        <label className="block text-sm mb-1">Title</label>
        <input
          name="title"
          required
          defaultValue={defaultValues?.title || ""}
          className="w-full h-11 px-3 rounded-md border border-black/[.08] dark:border-white/[.12] bg-background"
        />
      </div>
      <div>
        <label className="block text-sm mb-1">Description</label>
        <textarea
          name="description"
          rows={3}
          defaultValue={defaultValues?.description || ""}
          className="w-full px-3 py-2 rounded-md border border-black/[.08] dark:border-white/[.12] bg-background"
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm mb-1">Cooking time (min)</label>
          <input
            name="cooking_time"
            type="number"
            min={0}
            defaultValue={defaultValues?.cooking_time ?? undefined}
            className="w-full h-11 px-3 rounded-md border border-black/[.08] dark:border-white/[.12] bg-background"
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Difficulty</label>
          <select name="difficulty" defaultValue={defaultValues?.difficulty || ""} className="w-full h-11 px-3 rounded-md border border-black/[.08] dark:border-white/[.12] bg-background">
            <option value="">Select</option>
            <option>Easy</option>
            <option>Medium</option>
            <option>Hard</option>
          </select>
        </div>
        <div>
          <label className="block text-sm mb-1">Category</label>
          <input name="category" defaultValue={defaultValues?.category || ""} className="w-full h-11 px-3 rounded-md border border-black/[.08] dark:border-white/[.12] bg-background" />
        </div>
      </div>
      <div>
        <label className="block text-sm mb-1">Ingredients</label>
        <textarea
          name="ingredients"
          rows={4}
          placeholder="One per line"
          defaultValue={defaultValues?.ingredients || ""}
          className="w-full px-3 py-2 rounded-md border border-black/[.08] dark:border-white/[.12] bg-background"
        />
      </div>
      <div>
        <label className="block text-sm mb-1">Instructions</label>
        <textarea
          name="instructions"
          rows={6}
          defaultValue={defaultValues?.instructions || ""}
          className="w-full px-3 py-2 rounded-md border border-black/[.08] dark:border-white/[.12] bg-background"
        />
      </div>
      <div className="pt-2">
        <button className="h-11 px-4 rounded-md bg-foreground text-background text-sm font-medium cursor-pointer">{submitText}</button>
      </div>
    </form>
  );
}


