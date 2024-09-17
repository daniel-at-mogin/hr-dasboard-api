type ResBody<TData> = {
  status: number;
  success: boolean;
  message?: string;
  data?: TData | undefined;
}

type Team = {
  id?: string;
  name: string;
}

type Project = {
  id?: string;
  name: string;
}