import { createMemo, createSignal } from 'solid-js'

export interface SuggestProps<T = string> {
  onQuery: (query: string) => T[],  // Suggestions assumed ordered by client
  onSelect: (suggestion: T) => void,
  renderSuggestion: (suggestion: T) => HTMLElement,
  reverseKeyInput?: boolean,
}

export default function Suggest(props: SuggestProps) {
  const [query, setQuery] = createSignal('');
  const [staged, setStaged] = createSignal<number | null>(null);
  const suggestions = createMemo(() => props.onQuery(query()));

  function stageSuggestion(index: number) {
    setStaged(index);
  }

  function stageNextSuggestion() {
    setStaged(s => {
      if (suggestions().length === 0) return null;
      const current = s ?? -1;
      return (current + 1) % suggestions().length;
    });
  };

  function stagePrevSuggestion() {
    setStaged(s => {
      if (suggestions().length === 0) return null;
      const current = s ?? 0;
      return (current - 1 + suggestions().length) % suggestions().length;
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
    setStaged(null);
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
    aria-expanded={suggestions().length > 0}
    aria-haspopup='listbox'
  >
    <input
      type='search'
      class='s-sug-search'
      value={query()}
      on:input={e => setQuery(e.currentTarget.value)}
      on:keydown={handleKeyDown}
      aria-autocomplete='list'
    />
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
  </div>
}
