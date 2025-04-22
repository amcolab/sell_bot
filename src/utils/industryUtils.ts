import industryData from '../data/data.json'

export const getTopLevelIndustries = () => {
  return industryData.filter((item) => item.parentId === null)
}

export const getChildIndustries = (parentId: number | null) => {
  return industryData.filter((item) => item.parentId === parentId)
}

export const convertToSelectOptions = (industries: any[]) => {
  return [
    { value: '', label: '選択してください' },
    ...industries.map((industry) => ({
      value: industry.id.toString(),
      label: industry.value,
    })),
  ]
}

export const getIndustryById = (id: any) => {
  return industryData.find((item: any) => item.id === Number(id))
}

export const hasChildren = (id: string | number) => {
  const numericId = typeof id === 'string' ? parseInt(id) : id;
  return industryData.some((item) => item.parentId === numericId);
}

export const getIndustryByValue = (value: string) => {
  
  return industryData.find((item) => item.value === value)
}
