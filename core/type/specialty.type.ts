export type Specialty = {
  id: number;
  name: string;
  desc: string | null;
};

export type CreateSpecialty = {
  name: string;
  desc?: string;
};

export type UpdateSpecialty = CreateSpecialty;
