export const CATEGORY_LABELS = {
  EXECUTIVE: 'Executive',
  COMMITTEE_WITH_FAMILY: 'Committee with Family',
  SINGLE_COMMITTEE: 'Single Committee',
  FAMILY_WITH_ONE_CHILD: 'Family with one child',
  FAMILY_WITH_MULTIPLE_CHILDREN: 'Family with multiple children',
  GRANDPARENTS: 'Grandparents',
}

export const CATEGORY_LEVIES = {
  [CATEGORY_LABELS.EXECUTIVE]: 300,
  [CATEGORY_LABELS.COMMITTEE_WITH_FAMILY]: 250,
  [CATEGORY_LABELS.SINGLE_COMMITTEE]: 150,
  [CATEGORY_LABELS.FAMILY_WITH_ONE_CHILD]: 100,
  [CATEGORY_LABELS.FAMILY_WITH_MULTIPLE_CHILDREN]: 200,
  [CATEGORY_LABELS.GRANDPARENTS]: 75,
}

export const CATEGORY_OPTIONS = [
  { value: 'executive', label: CATEGORY_LABELS.EXECUTIVE },
  { value: 'committee_with_family', label: CATEGORY_LABELS.COMMITTEE_WITH_FAMILY },
  { value: 'single_committee', label: CATEGORY_LABELS.SINGLE_COMMITTEE },
  { value: 'family_one_child', label: CATEGORY_LABELS.FAMILY_WITH_ONE_CHILD },
  { value: 'family_multiple_children', label: CATEGORY_LABELS.FAMILY_WITH_MULTIPLE_CHILDREN },
  { value: 'grandparents', label: CATEGORY_LABELS.GRANDPARENTS },
]

