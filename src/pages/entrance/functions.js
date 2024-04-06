export const chooseDep = (setChoice, { choice }) => {
  setChoice(choice);
};

export const choices=[
  {
    label: "المدخل عن طريق البنك",
    data: "bank",
  },
  {
    label: "المدخل عن طريق الكاش",
    data: "cash",
  },
  {
    label: "إجمالى الدخل",
    data: "entrance",
  },
]
