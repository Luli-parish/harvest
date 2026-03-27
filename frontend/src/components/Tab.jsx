import { useMemo, useState } from 'react'

function Tab({ sections = [] }) {
  const hasSections = sections.length > 0

  const initialIndex = useMemo(() => (hasSections ? 0 : -1), [hasSections])
  const [activeIndex, setActiveIndex] = useState(initialIndex)

  if (!hasSections) {
    return <div className="alert alert-info mb-0">No sections available.</div>
  }

  const safeActiveIndex = activeIndex >= 0 && activeIndex < sections.length ? activeIndex : 0

  return (
    <div>
      <ul className="nav nav-tabs" role="tablist">
        {sections.map((section, index) => (
          <li className="nav-item" role="presentation" key={`${section.header}-${index}`}>
            <button
              type="button"
              role="tab"
              className={`nav-link ${safeActiveIndex === index ? 'active' : ''}`}
              aria-selected={safeActiveIndex === index}
              onClick={() => setActiveIndex(index)}
            >
              {section.header}
            </button>
          </li>
        ))}
      </ul>

      <div className="border border-top-0 rounded-bottom px-1 py-2">
        {sections[safeActiveIndex]?.content}
      </div>
    </div>
  )
}

export default Tab
