import { createMemo, createSignal } from 'solid-js'

export interface SuggestProps<T = string> {
  onQuery: (query: string) => T[],  // Suggestions assumed ordered by client
  onSelect: (suggestion: T) => void,
  renderSuggestion: (suggestion: T) => HTMLElement,
  reverseKeyInput?: boolean,
  debounceMs?: number, // Debounce period in milliseconds
}

export default function Suggest(props: SuggestProps) {
  // Basic signals for component state
  const [query, setQuery] = createSignal('');
  const [staged, setStaged] = createSignal<number | null>(null);
  // Internal signal for user input, separate from query to handle optional debounce
  const [debouncedQuery, setDebouncedQuery] = createSignal('');

  // Just a variable to store debounce timeout, if applicable
  let debounceTimeout: ReturnType<typeof setTimeout> | null = null;

  const suggestions = createMemo(() => props.onQuery(debouncedQuery()));
  const numSuggestions = createMemo(() => suggestions().length);

  function handleInput(e: Event) {
    const value = (e.currentTarget as HTMLInputElement).value;
    setQuery(value);
    if (typeof props.debounceMs === 'number' && props.debounceMs > 0) {
      if (debounceTimeout) clearTimeout(debounceTimeout);
      debounceTimeout = setTimeout(() => {
        setDebouncedQuery(value);
      }, props.debounceMs);
    } else {
      setDebouncedQuery(value);
    }
  }

  function stageSuggestion(index: number) {
    setStaged(index);
  }

  function stageNextSuggestion() {
    setStaged(s => {
      if (suggestions().length === 0) return null;
      const current = s ?? -1;
      return (current + 1) % numSuggestions();
    });
  };

  function stagePrevSuggestion() {
    setStaged(s => {
      if (numSuggestions() === 0) return null;
      const current = s ?? 0;
      return (current - 1 + numSuggestions()) % numSuggestions();
    });
  };

  function selectStagedSuggestion() {
    const index = staged()
    if (index !== null) {
      props.onSelect(suggestions()[index]);
      reset();
    }
  }

  function reset() {
    setQuery('');
    setDebouncedQuery('');
    setStaged(null);
    if (debounceTimeout) clearTimeout(debounceTimeout);
  }

  // Handles special input for suggestion behavior
  function handleKeyDown(e: KeyboardEvent) {
    const keyInputReversed = props.reverseKeyInput ?? false;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (keyInputReversed) {
        stagePrevSuggestion();
      } else {
        stageNextSuggestion();
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (keyInputReversed) {
        stageNextSuggestion();
      } else {
        stagePrevSuggestion();
      }
    } else if (e.key === 'Enter') {
      e.preventDefault();
      selectStagedSuggestion();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      reset();
    }
    // else -> propagates up to allow input
  }

  return <div
    class='s-sug-container'
    role='combobox'
    aria-expanded={numSuggestions() > 0}
    aria-haspopup='listbox'
  >
    <input
      type='search'
      class='s-sug-search'
      value={query()}
      on:input={handleInput}
      on:keydown={handleKeyDown}
      aria-autocomplete='list'
    />
    {numSuggestions() > 0 &&
      <ul class='s-sug-suggestions' role='listbox'>
        {suggestions().map((s, i) => (
          <li
            class='s-sug-suggestion'
            data-staged={staged() === i}
            role='option'
            on:mouseenter={() => stageSuggestion(i)}
            on:click={selectStagedSuggestion}
            aria-selected={staged() === i ? 'true' : 'false'}
          >
            {props.renderSuggestion(s)}
          </li>)
        )}
      </ul>
    }
  </div>
}
