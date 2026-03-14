import { useState, useCallback, KeyboardEvent } from "react";
import { X, Plus } from "lucide-react";

interface EditableTagListProps {
  items: string[];
  onChange: (items: string[]) => void;
  placeholder?: string;
  tagClassName?: string;
}

const EditableTagList = ({ items, onChange, placeholder = "Add item...", tagClassName = "bg-accent text-muted-foreground" }: EditableTagListProps) => {
  const [input, setInput] = useState("");

  const handleAdd = useCallback(() => {
    const val = input.trim();
    if (val && !items.includes(val)) {
      onChange([...items, val]);
      setInput("");
    }
  }, [input, items, onChange]);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter") { e.preventDefault(); handleAdd(); }
  };

  const handleRemove = (item: string) => {
    onChange(items.filter((i) => i !== item));
  };

  return (
    <div>
      <div className="flex flex-wrap gap-1.5 mb-2">
        {items.map((item) => (
          <span key={item} className={`text-xs font-mono px-2 py-0.5 rounded-sm flex items-center gap-1 ${tagClassName}`}>
            {item}
            <button onClick={() => handleRemove(item)} className="hover:text-foreground transition-colors">
              <X className="w-2.5 h-2.5" />
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-1">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="flex-1 bg-accent text-foreground text-xs px-2 py-1.5 rounded-sm border border-panel-border focus:outline-none focus:border-primary placeholder:text-muted-foreground font-mono"
        />
        <button
          onClick={handleAdd}
          disabled={!input.trim()}
          className="px-2 py-1.5 bg-accent text-muted-foreground hover:text-foreground rounded-sm disabled:opacity-30 transition-colors"
        >
          <Plus className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};

export default EditableTagList;
