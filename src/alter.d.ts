declare module 'alter' {
  interface Fragment {
    start: number;
    end: number;
    str: string;
  }

  const alter: (text: string, rules: Fragment[]) => string

  export default alter
}
