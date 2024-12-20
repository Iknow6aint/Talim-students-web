export interface LoginFormData {
    email: string
    password: string
    rememberMe: boolean
  }
  
  export interface LoginPageProps {
    onSubmit?: (data: LoginFormData) => Promise<void>
  }
  
  