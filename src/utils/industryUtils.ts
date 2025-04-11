import industryData from '../data/data.json'

// Get top-level industries (parentId is null)
export const getTopLevelIndustries = () => {
  return industryData.filter((item) => item.parentId === null)
}

// Get children of a specific industry by parent value
export const getChildIndustries = (parentValue: string) => {
  // Find the parent industry by value
  const parentIndustry = industryData.find((item) => item.value === parentValue)
  if (!parentIndustry) return []

  // Return children of the parent industry
  return industryData.filter((item) => item.parentId === parentIndustry.id)
}

// Convert industry data to select options format
export const convertToSelectOptions = (industries: any[]) => {
  return [
    { value: '', label: '選択してください' },
    ...industries.map((industry) => ({
      value: industry.value,
      label: industry.value,
    })),
  ]
}

// Get industry by value
export const getIndustryByValue = (value: string) => {
  return industryData.find((item) => item.value === value)
}

// Check if an industry has children
export const hasChildren = (value: string) => {
  // Find the industry by value
  const industry = industryData.find((item) => item.value === value)
  if (!industry) return false

  // Check if it has children
  return industryData.some((item) => item.parentId === industry.id)
}
