"use client";

import { useEffect, useMemo, useState } from "react";
import { SubmitButton } from "./SubmitButton";

type Defaults = Partial<{
  title: string;
  description: string | null;
  cooking_time: number | null;
  difficulty: string | null;
  category: string | null;
  ingredients: string | null; // newline separated
  instructions: string | null; // newline separated
}>;

export function RecipeEditForm({ defaultValues, action }: { defaultValues: Defaults; action: (formData: FormData) => void }) {
  const [title, setTitle] = useState(defaultValues.title || "");
  const [description, setDescription] = useState(defaultValues.description || "");
  const [cookingTime, setCookingTime] = useState<number | "">(defaultValues.cooking_time ?? "");
  const [difficulty, setDifficulty] = useState(defaultValues.difficulty || "");
  const [category, setCategory] = useState(defaultValues.category || "");
  const [ingredients, setIngredients] = useState<string[]>(
    (defaultValues.ingredients || "")
      .split(/\r?\n/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0)
  );
  const [instructions, setInstructions] = useState<string[]>(
    (defaultValues.instructions || "")
      .split(/\r?\n/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0)
  );

  const ingredientsJoined = useMemo(() => ingredients.join("\n"), [ingredients]);
  const instructionsJoined = useMemo(() => instructions.join("\n"), [instructions]);

  function updateList(index: number, value: string, list: string[], setList: (v: string[]) => void) {
    const next = list.slice();
    next[index] = value;
    setList(next);
  }
  function removeAt(index: number, list: string[], setList: (v: string[]) => void) {
    setList(list.filter((_, i) => i !== index));
  }

  return (
    <form action={action} className="space-y-4">
      <div>
        <label className="block text-sm mb-1">Title</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} name="title" required className="w-full h-11 px-3 rounded-md border border-black/[.08] dark:border-white/[.12] bg-background" />
      </div>

      <div>
        <label className="block text-sm mb-1">Description</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} name="description" rows={3} className="w-full px-3 py-2 rounded-md border border-black/[.08] dark:border-white/[.12] bg-background" />
      </div>

      <div>
        <label className="block text-sm font-medium">Ingredients</label>
        <div className="mt-2 space-y-2">
          {ingredients.map((val, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <input
                value={val}
                onChange={(e) => updateList(idx, e.target.value, ingredients, setIngredients)}
                className="flex-1 h-10 px-3 rounded-md border border-black/[.08] dark:border-white/[.12] bg-background"
              />
              <button type="button" onClick={() => removeAt(idx, ingredients, setIngredients)} className="text-xs text-red-600 hover:underline cursor-pointer">
                Remove
              </button>
            </div>
          ))}
          <button type="button" onClick={() => setIngredients([...ingredients, ""])} className="text-xs text-black/70 dark:text-white/70 hover:underline cursor-pointer">
            + Add Ingredient
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium">Instructions</label>
        <div className="mt-2 space-y-2">
          {instructions.map((val, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <input
                value={val}
                onChange={(e) => updateList(idx, e.target.value, instructions, setInstructions)}
                className="flex-1 h-10 px-3 rounded-md border border-black/[.08] dark:border-white/[.12] bg-background"
              />
              <button type="button" onClick={() => removeAt(idx, instructions, setInstructions)} className="text-xs text-red-600 hover:underline cursor-pointer">
                Remove
              </button>
            </div>
          ))}
          <button type="button" onClick={() => setInstructions([...instructions, ""])} className="text-xs text-black/70 dark:text-white/70 hover:underline cursor-pointer">
            + Add Step
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm mb-1">Cooking Time (minutes)</label>
          <input
            name="cooking_time"
            type="number"
            min={0}
            value={cookingTime}
            onChange={(e) => setCookingTime(e.target.value === "" ? "" : Number(e.target.value))}
            className="w-full h-11 px-3 rounded-md border border-black/[.08] dark:border-white/[.12] bg-background"
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Difficulty</label>
          <select name="difficulty" value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className="w-full h-11 px-3 rounded-md border border-black/[.08] dark:border-white/[.12] bg-background">
            <option value="">Select</option>
            <option>Easy</option>
            <option>Medium</option>
            <option>Hard</option>
          </select>
        </div>
        <div>
          <label className="block text-sm mb-1">Category</label>
          <input name="category" value={category} onChange={(e) => setCategory(e.target.value)} className="w-full h-11 px-3 rounded-md border border-black/[.08] dark:border-white/[.12] bg-background" />
        </div>
      </div>

      {/* Hidden fields that the server action expects */}
      <input type="hidden" name="ingredients" value={ingredientsJoined} />
      <input type="hidden" name="instructions" value={instructionsJoined} />

      <div className="pt-2">
        <SubmitButton pendingText="Saving…" className="h-11 w-full sm:w-auto px-5 rounded-md bg-black text-white text-sm font-medium" >
          Save Recipe
        </SubmitButton>
      </div>
    </form>
  );
}


