import industryData from '../data/data.json'

// Get top-level industries (parentId is null)
export const getTopLevelIndustries = () => {
  return industryData.filter((item) => item.parentId === null)
}

// Get children of a specific industry by parent id
export const getChildIndustries = (parentId: number | null) => {
  // Return children of the parent industry directly using parentId
  return industryData.filter((item) => item.parentId === parentId)
}

// Convert industry data to select options format
export const convertToSelectOptions = (industries: any[]) => {
  return [
    { value: '', label: '選択してください' },
    ...industries.map((industry) => ({
      value: industry.id.toString(), // Convert id to string
      label: industry.value,
    })),
  ]
}

// Get industry by id
export const getIndustryById = (id: number) => {
  return industryData.find((item) => item.id === id)
}

// Check if an industry has children
export const hasChildren = (id: string | number) => {
  // Convert id to number if it's a string
  const numericId = typeof id === 'string' ? parseInt(id) : id;
  console.log(numericId);
  // Check if it has children directly
  return industryData.some((item) => item.parentId === numericId);
}

// Get industry by value (name)
export const getIndustryByValue = (value: string) => {
  console.log(value);
  
  return industryData.find((item) => item.value === value)
}
