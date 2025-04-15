import { Controller } from "react-hook-form";
import { useEffect, useState } from "react";
import Input from "../components/input";
import Select from "../components/select";
import { formatNumber } from "../utils/utils";
import {
  getTopLevelIndustries,
  getChildIndustries,
  convertToSelectOptions,
  hasChildren,
} from "../utils/industryUtils";
import { useFieldArray } from 'react-hook-form';
import Radio from "../components/radio";
import HeaderSection from '../components/header-section';

const BusinessInformation = ({
  control,
  errors,
  saveDataToLocalStorage,
  watch,
  ensureSubsidiaryStructure,
  setValue
}: any) => {
  const applicationType = watch("applicationType");
  const numberOfSubsidiaries = watch("numberOfSubsidiaries");
  const subsidiariesCount = numberOfSubsidiaries
    ? parseInt(numberOfSubsidiaries)
    : 0;

  const { fields, replace } = useFieldArray({
    control,
    name: 'subsidiaries',
  });

  // 階層的な業種選択のための状態
  const [topLevelIndustries, setTopLevelIndustries] = useState(
    convertToSelectOptions(getTopLevelIndustries())
  );
  const [secondLevelIndustries, setSecondLevelIndustries] = useState([
    { value: "", label: "選択してください" },
  ]);
  const [thirdLevelIndustries, setThirdLevelIndustries] = useState([
    { value: "", label: "選択してください" },
  ]);

  // Watch for changes in industry selections
  const selectedIndustry1 = watch("mainCompany.industry.category1");
  const selectedIndustry2 = watch("mainCompany.industry.category2");

  // Update second level industries when first level changes
  useEffect(() => {
    if (selectedIndustry1) {
      const children = getChildIndustries(selectedIndustry1);
      setSecondLevelIndustries(convertToSelectOptions(children));
    } else {
      setSecondLevelIndustries([{ value: "", label: "選択してください" }]);
      // Only reset child categories if parent is cleared
      saveDataToLocalStorage("mainCompany.industry.category2", "");
      saveDataToLocalStorage("mainCompany.industry.category3", "");
    }
  }, [selectedIndustry1, saveDataToLocalStorage]);

  // Update third level industries when second level changes
  useEffect(() => {
    if (selectedIndustry2) {
      const children = getChildIndustries(selectedIndustry2);
      setThirdLevelIndustries(convertToSelectOptions(children));
    } else {
      setThirdLevelIndustries([{ value: "", label: "選択してください" }]);
      // Only reset category3 if category2 is cleared
      saveDataToLocalStorage("mainCompany.industry.category3", "");
    }
  }, [selectedIndustry2]);

  // Add effect to handle revenuePercentage3 reset
  useEffect(() => {
    const rev1 = parseInt(watch("mainCompany.industry.revenuePercentage1") || "0");
    const rev2 = parseInt(watch("mainCompany.industry.revenuePercentage2") || "0");
    if (rev1 + rev2 < 50) {
      saveDataToLocalStorage("mainCompany.industry.revenuePercentage3", "");
      setValue("mainCompany.industry.revenuePercentage3", "")
    }
  }, [watch("mainCompany.industry.revenuePercentage1"), watch("mainCompany.industry.revenuePercentage2")]);

  // Handle subsidiary count change
  useEffect(() => {
    if (applicationType === "子会社含む" && subsidiariesCount > 0) {
      const newFields = Array(subsidiariesCount).fill(null).map(() => ({
        industry: {
          category1: "",
          category2: "",
          category3: "",
          specialCase: "",
          revenuePercentage1: "",
          revenuePercentage2: "",
          revenuePercentage3: ""
        },
        financial: {
          profit: "0",
          dividends: "0"
        }
      }));
      replace(newFields);
    } else {
      replace([]);
    }
  }, [applicationType, subsidiariesCount, replace]);

  return (
    <HeaderSection title="会社情報" stepNumber={4}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <Controller
          name="mainCompany.industry.category1"
          control={control}
          render={({ field }) => (
            <div>
              <Select
                name={field.name}
                id={field.name}
                label="業種目大分類"
                required={true}
                value={field.value}
                error={errors.mainCompany?.industry?.category1?.message}
                options={topLevelIndustries}
                onchange={(e) => {
                  field.onChange(e);
                  saveDataToLocalStorage(
                    "mainCompany.industry.category1",
                    e.target.value
                  );
                }}
              />
            </div>
          )}
        />

        {selectedIndustry1 && hasChildren(selectedIndustry1) && (
          <Controller
            name="mainCompany.industry.category2"
            control={control}
            render={({ field }) => (
              <div>
                <Select
                  name={field.name}
                  id={field.name}
                  label="業種目中分類"
                  required={true}
                  value={field.value}
                  error={errors.mainCompany?.industry?.category2?.message}
                  options={secondLevelIndustries}
                  onchange={(e) => {
                    field.onChange(e);
                    saveDataToLocalStorage(
                      "mainCompany.industry.category2",
                      e.target.value
                    );
                  }}
                />
              </div>
            )}
          />
        )}

        {selectedIndustry2 && hasChildren(selectedIndustry2) && (
          <Controller
            name="mainCompany.industry.category3"
            control={control}
            render={({ field }) => (
              <div>
                <Select
                  name={field.name}
                  id={field.name}
                  label="業種目小分類"
                  required={true}
                  value={field.value}
                  error={errors.mainCompany?.industry?.category3?.message}
                  options={thirdLevelIndustries}
                  onchange={(e) => {
                    field.onChange(e);
                    saveDataToLocalStorage(
                      "mainCompany.industry.category3",
                      e.target.value
                    );
                  }}
                />
              </div>
            )}
          />
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            業種区分特例
          </label>
          <div className="space-y-2">
            <Controller
              name="mainCompany.industry.specialCase"
              control={control}
              render={({ field }) => (
                <div className="space-y-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name={field.name}
                      value="over50"
                      checked={field.value === "over50"}
                      onChange={(e) => {
                        field.onChange(e.target.value);
                        saveDataToLocalStorage(
                          "mainCompany.industry.specialCase",
                          e.target.value
                        );
                      }}
                      className="form-radio h-4 w-4 text-blue-600"
                    />
                    <span>本業の売上高が50超</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name={field.name}
                      value="under50"
                      checked={field.value === "under50"}
                      onChange={(e) => {
                        field.onChange(e.target.value);
                        saveDataToLocalStorage(
                          "mainCompany.industry.specialCase",
                          e.target.value
                        );
                      }}
                      className="form-radio h-4 w-4 text-blue-600"
                    />
                    <span>本業の売上高が50以下</span>
                  </label>
                </div>
              )}
            />
          </div>
        </div>

        {watch("mainCompany.industry.specialCase") === "under50" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Controller
                name="mainCompany.industry.revenuePercentage1"
                control={control}
                render={({ field }) => (
                  <div>
                    <Input
                      type="text"
                      name={field.name}
                      id={field.name}
                      label="主たる事業の売上"
                      required={true}
                      placeholder="%"
                      value={field.value ? `${field.value}` : ""}
                      error={
                        errors.mainCompany?.industry?.revenuePercentage1
                          ?.message
                      }
                      onchange={(e) => {
                        const value = e.target.value.replace(/[^\d]/g, "");
                        let cleanValue = "";
                        if (value === "0") {
                          field.onChange("");
                          saveDataToLocalStorage(
                            "mainCompany.industry.revenuePercentage1",
                            ""
                          );
                        } else {
                          // Remove leading zeros
                          cleanValue = value.replace(/^0+/, "");
                          field.onChange(cleanValue);
                          saveDataToLocalStorage(
                            "mainCompany.industry.revenuePercentage1",
                            cleanValue
                          );
                        }
                      }}
                      onblur={() => {
                        if (!field.value) {
                          field.onChange("");
                          saveDataToLocalStorage(
                            "mainCompany.industry.revenuePercentage1",
                            ""
                          );
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          (e.target as HTMLInputElement).blur();
                        }
                      }}
                    />
                  </div>
                )}
              />

              <Controller
                name="mainCompany.industry.revenuePercentage2"
                control={control}
                render={({ field }) => (
                  <div>
                    <Input
                      type="text"
                      name={field.name}
                      id={field.name}
                      label="２位の売上"
                      required={true}
                      placeholder="%"
                      value={field.value ? `${field.value}` : ""}
                      error={
                        errors.mainCompany?.industry?.revenuePercentage2
                          ?.message
                      }
                      onchange={(e) => {
                        const value = e.target.value.replace(/[^\d]/g, "");
                        let cleanValue = "";
                        if (value === "0") {
                          field.onChange("");
                          saveDataToLocalStorage(
                            "mainCompany.industry.revenuePercentage2",
                            ""
                          );
                        } else {
                          // Remove leading zeros
                          cleanValue = value.replace(/^0+/, "");
                          field.onChange(cleanValue);
                          saveDataToLocalStorage(
                            "mainCompany.industry.revenuePercentage2",
                            cleanValue
                          );
                        }
                      }}
                      onblur={() => {
                        if (!field.value) {
                          field.onChange("");
                          saveDataToLocalStorage(
                            "mainCompany.industry.revenuePercentage2",
                            ""
                          );
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          (e.target as HTMLInputElement).blur();
                        }
                      }}
                    />
                  </div>
                )}
              />
            </div>

            {watch("mainCompany.industry.revenuePercentage1") &&
              watch("mainCompany.industry.revenuePercentage2") &&
              parseInt(watch("mainCompany.industry.revenuePercentage1")) +
                parseInt(watch("mainCompany.industry.revenuePercentage2")) <
                50 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Controller
                      name="mainCompany.industry.revenuePercentage3"
                      control={control}
                      render={({ field }) => (
                        <div>
                          <Input
                            type="text"
                            name={field.name}
                            id={field.name}
                            label="３位の売上"
                            required={true}
                            placeholder="%"
                            value={field.value ? `${field.value}` : ""}
                            error={
                              errors.mainCompany?.industry?.revenuePercentage3
                                ?.message
                            }
                            onchange={(e) => {
                              const value = e.target.value.replace(/[^\d]/g, "");
                              if (value === "0") {
                                field.onChange("");
                                saveDataToLocalStorage(
                                  "mainCompany.industry.revenuePercentage3",
                                  ""
                                );
                              } else {
                                // Remove leading zeros
                                const cleanValue = value.replace(/^0+/, "");
                                field.onChange(cleanValue);
                                saveDataToLocalStorage(
                                  "mainCompany.industry.revenuePercentage3",
                                  cleanValue
                                );
                              }
                            }}
                            onblur={() => {
                              if (!field.value) {
                                field.onChange("");
                                saveDataToLocalStorage(
                                  "mainCompany.industry.revenuePercentage3",
                                  ""
                                );
                              }
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                (e.target as HTMLInputElement).blur();
                              }
                            }}
                          />
                        </div>
                      )}
                    />
                  </div>
                </div>
              )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Controller
          name="mainCompany.financial.profit"
          control={control}
          render={({ field }) => (
            <div>
              <Input
                type="text"
                name={field.name}
                id={field.name}
                label="利益（1年目〜10年目）"
                required={false}
                placeholder="利益を入力してください（単位：円）"
                value={field.value ? `¥${formatNumber(field.value)}` : "¥0"}
                error={errors.mainCompany?.financial?.profit?.message}
                onchange={(e) => {
                  const value = e.target.value.replace(/[^\d]/g, "");
                  if (value === "0") {
                    field.onChange("0");
                    saveDataToLocalStorage(
                      "mainCompany.financial.profit",
                      "0"
                    );
                  } else {
                    // Remove leading zeros
                    const cleanValue = value.replace(/^0+/, "");
                    const formattedValue = formatNumber(cleanValue);
                    field.onChange(formattedValue);
                    saveDataToLocalStorage(
                      "mainCompany.financial.profit",
                      formattedValue
                    );
                  }
                }}
                onblur={() => {
                  if (!field.value) {
                    field.onChange("0");
                    saveDataToLocalStorage(
                      "mainCompany.financial.profit",
                      "0"
                    );
                  }
                }}
              />
              <p className="text-sm text-gray-600 mt-1">
                ※記載がない場合には前年度利益と同額と仮定します。
              </p>
            </div>
          )}
        />

        <Controller
          name="mainCompany.financial.dividends"
          control={control}
          render={({ field }) => (
            <div>
              <Input
                type="text"
                name={field.name}
                id={field.name}
                label="配当（1年目〜10年目）"
                required={true}
                placeholder="配当金を入力してください（単位：円）"
                value={field.value ? `¥${formatNumber(field.value)}` : "¥0"}
                error={errors.mainCompany?.financial?.dividends?.message}
                onchange={(e) => {
                  const value = e.target.value.replace(/[^\d]/g, "");
                  if (value === "0") {
                    field.onChange("0");
                    saveDataToLocalStorage(
                      "mainCompany.financial.dividends",
                      "0"
                    );
                  } else {
                    // Remove leading zeros
                    const cleanValue = value.replace(/^0+/, "");
                    const formattedValue = formatNumber(cleanValue);
                    field.onChange(formattedValue);
                    saveDataToLocalStorage(
                      "mainCompany.financial.dividends",
                      formattedValue
                    );
                  }
                }}
                onblur={() => {
                  if (!field.value) {
                    field.onChange("0");
                    saveDataToLocalStorage(
                      "mainCompany.financial.dividends",
                      "0"
                    );
                  }
                }}
              />
            </div>
          )}
        />
      </div>

      {applicationType === "子会社含む" && subsidiariesCount > 0 && (
        <>
          {fields.map((field, index) => (
            <div key={field.id} className="mt-2">
              <h3 className="text-lg font-semibold mb-3">
                子会社 {index + 1} 情報
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <Controller
                  name={`subsidiaries.${index}.industry.category1`}
                  control={control}
                  render={({ field }) => (
                    <div>
                      <Select
                        name={field.name}
                        id={field.name}
                        label="業種目大分類"
                        required={true}
                        value={field.value}
                        error={errors.subsidiaries?.[index]?.industry?.category1?.message}
                        options={topLevelIndustries}
                        onchange={(e) => {
                          field.onChange(e);
                          ensureSubsidiaryStructure(index);
                          saveDataToLocalStorage(
                            `subsidiaries.${index}.industry.category1`,
                            e.target.value
                          );
                        }}
                      />
                    </div>
                  )}
                />

                {watch(`subsidiaries.${index}.industry.category1`) &&
                  hasChildren(watch(`subsidiaries.${index}.industry.category1`)) && (
                    <Controller
                      name={`subsidiaries.${index}.industry.category2`}
                      control={control}
                      render={({ field }) => (
                        <div>
                          <Select
                            name={field.name}
                            id={field.name}
                            label="業種目中分類"
                            value={field.value}
                            error={errors.subsidiaries?.[index]?.industry?.category2?.message}
                            options={getChildIndustries(
                              watch(`subsidiaries.${index}.industry.category1`)
                            ).map((child) => ({
                              value: child.value,
                              label: child.value,
                            }))}
                            onchange={(e) => {
                              field.onChange(e);
                              ensureSubsidiaryStructure(index);
                              saveDataToLocalStorage(
                                `subsidiaries.${index}.industry.category2`,
                                e.target.value
                              );
                            }}
                            required={true}
                          />
                        </div>
                      )}
                    />
                  )}

                {watch(`subsidiaries.${index}.industry.category2`) &&
                  hasChildren(watch(`subsidiaries.${index}.industry.category2`)) && (
                    <Controller
                      name={`subsidiaries.${index}.industry.category3`}
                      control={control}
                      render={({ field }) => (
                        <div>
                          <Select
                            name={field.name}
                            id={field.name}
                            label="業種目小分類"
                            required={true}
                            value={field.value}
                            error={errors.subsidiaries?.[index]?.industry?.category3?.message}
                            options={getChildIndustries(
                              watch(`subsidiaries.${index}.industry.category2`)
                            ).map((child) => ({
                              value: child.value,
                              label: child.value,
                            }))}
                            onchange={(e) => {
                              field.onChange(e);
                              ensureSubsidiaryStructure(index);
                              saveDataToLocalStorage(
                                `subsidiaries.${index}.industry.category3`,
                                e.target.value
                              );
                            }}
                          />
                        </div>
                      )}
                    />
                  )}

                <div className="grid grid-cols-1 gap-4 mb-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      業種区分特例
                    </label>
                    <div className="space-y-2">
                      <Controller
                        name={`subsidiaries.${index}.industry.specialCase`}
                        control={control}
                        render={({ field }) => (
                          <div className="space-y-2">
                            <Radio
                              name={field.name}
                              id={`${field.name}_over50`}
                              title="本業の売上高が50超"
                              value="over50"
                              checked={field.value === "over50"}
                              onChange={(e) => {
                                field.onChange(e.target.value);
                                ensureSubsidiaryStructure(index);
                                saveDataToLocalStorage(
                                  `subsidiaries.${index}.industry.specialCase`,
                                  e.target.value
                                );
                              }}
                            />
                            <Radio
                              name={field.name}
                              id={`${field.name}_under50`}
                              title="本業の売上高が50以下"
                              value="under50"
                              checked={field.value === "under50"}
                              onChange={(e) => {
                                field.onChange(e.target.value);
                                ensureSubsidiaryStructure(index);
                                saveDataToLocalStorage(
                                  `subsidiaries.${index}.industry.specialCase`,
                                  e.target.value
                                );
                              }}
                            />
                            {errors.subsidiaries?.[index]?.industry?.specialCase && (
                              <p className="text-red-500 text-sm mt-1">
                                {errors.subsidiaries[index].industry.specialCase.message}
                              </p>
                            )}
                          </div>
                        )}
                      />
                    </div>
                  </div>

                  {watch(`subsidiaries.${index}.industry.specialCase`) === "under50" && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Controller
                          name={`subsidiaries.${index}.industry.revenuePercentage1`}
                          control={control}
                          render={({ field }) => (
                            <div>
                              <Input
                                type="text"
                                name={field.name}
                                id={field.name}
                                label="主たる事業の売上"
                                required={true}
                                placeholder="%"
                                value={field.value ? `${field.value}` : ""}
                                error={errors.subsidiaries?.[index]?.industry?.revenuePercentage1?.message}
                                onchange={(e) => {
                                  const value = e.target.value.replace(/[^\d]/g, "");
                                  let cleanValue = "";
                                  if (value === "0") {
                                    field.onChange("");
                                    ensureSubsidiaryStructure(index);
                                    saveDataToLocalStorage(
                                      `subsidiaries.${index}.industry.revenuePercentage1`,
                                      ""
                                    );
                                  } else {
                                    cleanValue = value.replace(/^0+/, "");
                                    field.onChange(cleanValue);
                                    ensureSubsidiaryStructure(index);
                                    saveDataToLocalStorage(
                                      `subsidiaries.${index}.industry.revenuePercentage1`,
                                      cleanValue
                                    );
                                  }
                                  const rev1 = parseInt(cleanValue || "0");
                                  const rev2 = parseInt(watch(`subsidiaries.${index}.industry.revenuePercentage2`) || "0");
                                  if (rev1 + rev2 < 50) {
                                    saveDataToLocalStorage(
                                      `subsidiaries.${index}.industry.revenuePercentage3`,
                                      "0"
                                    );
                                    setValue(`subsidiaries.${index}.industry.revenuePercentage3`, '');
                                  }
                                }}
                                onblur={() => {
                                  if (!field.value) {
                                    field.onChange("");
                                    ensureSubsidiaryStructure(index);
                                    saveDataToLocalStorage(
                                      `subsidiaries.${index}.industry.revenuePercentage1`,
                                      ""
                                    );
                                  }
                                }}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    e.preventDefault();
                                    (e.target as HTMLInputElement).blur();
                                  }
                                }}
                              />
                            </div>
                          )}
                        />

                        <Controller
                          name={`subsidiaries.${index}.industry.revenuePercentage2`}
                          control={control}
                          render={({ field }) => (
                            <div>
                              <Input
                                type="text"
                                name={field.name}
                                id={field.name}
                                label="２位の売上"
                                required={true}
                                placeholder="%"
                                value={field.value ? `${field.value}` : ""}
                                error={errors.subsidiaries?.[index]?.industry?.revenuePercentage2?.message}
                                onchange={(e) => {
                                  const value = e.target.value.replace(/[^\d]/g, "");
                                  let cleanValue = "";
                                  if (value === "0") {
                                    field.onChange("");
                                    ensureSubsidiaryStructure(index);
                                    saveDataToLocalStorage(
                                      `subsidiaries.${index}.industry.revenuePercentage2`,
                                      ""
                                    );
                                  } else {
                                    cleanValue = value.replace(/^0+/, "");
                                    field.onChange(cleanValue);
                                    ensureSubsidiaryStructure(index);
                                    saveDataToLocalStorage(
                                      `subsidiaries.${index}.industry.revenuePercentage2`,
                                      cleanValue
                                    );
                                  }
                                  const rev1 = parseInt(watch(`subsidiaries.${index}.industry.revenuePercentage1`) || "0");
                                  const rev2 = parseInt(cleanValue || "0");
                                  if (rev1 + rev2 < 50) {
                                    saveDataToLocalStorage(
                                      `subsidiaries.${index}.industry.revenuePercentage3`,
                                      "0"
                                    );
                                    setValue(`subsidiaries.${index}.industry.revenuePercentage3`, '');
                                  }
                                }}
                                onblur={() => {
                                  if (!field.value) {
                                    field.onChange("");
                                    ensureSubsidiaryStructure(index);
                                    saveDataToLocalStorage(
                                      `subsidiaries.${index}.industry.revenuePercentage2`,
                                      ""
                                    );
                                  }
                                }}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    e.preventDefault();
                                    (e.target as HTMLInputElement).blur();
                                  }
                                }}
                              />
                            </div>
                          )}
                        />
                      </div>

                      {watch(`subsidiaries.${index}.industry.revenuePercentage1`) &&
                        watch(`subsidiaries.${index}.industry.revenuePercentage2`) &&
                        parseInt(watch(`subsidiaries.${index}.industry.revenuePercentage1`)) +
                          parseInt(watch(`subsidiaries.${index}.industry.revenuePercentage2`)) <
                          50 && (
                          <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <Controller
                                name={`subsidiaries.${index}.industry.revenuePercentage3`}
                                control={control}
                                render={({ field }) => (
                                  <div>
                                    <Input
                                      type="text"
                                      name={field.name}
                                      id={field.name}
                                      label="３位の売上"
                                      required={true}
                                      placeholder="%"
                                      value={field.value ? `${field.value}` : ""}
                                      error={errors.subsidiaries?.[index]?.industry?.revenuePercentage3?.message}
                                      onchange={(e) => {
                                        const value = e.target.value.replace(/[^\d]/g, "");
                                        if (value === "0") {
                                          field.onChange("");
                                          ensureSubsidiaryStructure(index);
                                          saveDataToLocalStorage(
                                            `subsidiaries.${index}.industry.revenuePercentage3`,
                                            ""
                                          );
                                        } else {
                                          const cleanValue = value.replace(/^0+/, "");
                                          field.onChange(cleanValue);
                                          ensureSubsidiaryStructure(index);
                                          saveDataToLocalStorage(
                                            `subsidiaries.${index}.industry.revenuePercentage3`,
                                            cleanValue
                                          );
                                        }
                                      }}
                                      onblur={() => {
                                        if (!field.value) {
                                          field.onChange("");
                                          ensureSubsidiaryStructure(index);
                                          saveDataToLocalStorage(
                                            `subsidiaries.${index}.industry.revenuePercentage3`,
                                            ""
                                          );
                                        }
                                      }}
                                      onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                          e.preventDefault();
                                          (e.target as HTMLInputElement).blur();
                                        }
                                      }}
                                    />
                                  </div>
                                )}
                              />
                            </div>
                          </div>
                        )}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Controller
                    name={`subsidiaries.${index}.financial.profit`}
                    control={control}
                    render={({ field }) => (
                      <div>
                        <Input
                          type="text"
                          name={field.name}
                          id={field.name}
                          label="利益（1年目〜10年目）"
                          required={false}
                          placeholder="利益を入力してください（単位：円）"
                          value={field.value ? `¥${formatNumber(field.value)}` : "¥0"}
                          error={errors.subsidiaries?.[index]?.financial?.profit?.message}
                          onchange={(e) => {
                            const value = e.target.value.replace(/[^\d]/g, "");
                            if (value === "0") {
                              field.onChange("0");
                              ensureSubsidiaryStructure(index);
                              saveDataToLocalStorage(
                                `subsidiaries.${index}.financial.profit`,
                                "0"
                              );
                            } else {
                              const cleanValue = value.replace(/^0+/, "");
                              const formattedValue = formatNumber(cleanValue);
                              field.onChange(formattedValue);
                              ensureSubsidiaryStructure(index);
                              saveDataToLocalStorage(
                                `subsidiaries.${index}.financial.profit`,
                                formattedValue
                              );
                            }
                          }}
                          onblur={() => {
                            if (!field.value) {
                              field.onChange("0");
                              ensureSubsidiaryStructure(index);
                              saveDataToLocalStorage(
                                `subsidiaries.${index}.financial.profit`,
                                "0"
                              );
                            }
                          }}
                        />
                        <p className="text-sm text-gray-600 mt-1">
                          ※記載がない場合には前年度利益と同額と仮定します。
                        </p>
                      </div>
                    )}
                  />

                  <Controller
                    name={`subsidiaries.${index}.financial.dividends`}
                    control={control}
                    render={({ field }) => (
                      <div>
                        <Input
                          type="text"
                          name={field.name}
                          id={field.name}
                          label="配当（1年目〜10年目）"
                          placeholder="配当金を入力してください（単位：円）"
                          value={field.value ? `¥${formatNumber(field.value)}` : "¥0"}
                          error={errors.subsidiaries?.[index]?.financial?.dividends?.message}
                          onchange={(e) => {
                            const value = e.target.value.replace(/[^\d]/g, "");
                            if (value === "0") {
                              field.onChange("0");
                              ensureSubsidiaryStructure(index);
                              saveDataToLocalStorage(
                                `subsidiaries.${index}.financial.dividends`,
                                "0"
                              );
                            } else {
                              const cleanValue = value.replace(/^0+/, "");
                              const formattedValue = formatNumber(cleanValue);
                              field.onChange(formattedValue);
                              ensureSubsidiaryStructure(index);
                              saveDataToLocalStorage(
                                `subsidiaries.${index}.financial.dividends`,
                                formattedValue
                              );
                            }
                          }}
                          onblur={() => {
                            if (!field.value) {
                              field.onChange("0");
                              ensureSubsidiaryStructure(index);
                              saveDataToLocalStorage(
                                `subsidiaries.${index}.financial.dividends`,
                                "0"
                              );
                            }
                          }}
                        />
                      </div>
                    )}
                  />
                </div>      
              </div>
            </div>
          ))}
        </>
      )}
      <div className="h-px bg-[#eee] my-5"></div>
    </HeaderSection>
  );
};

export default BusinessInformation;
