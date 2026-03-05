// "use client";

import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";

// import { useLocale } from "next-intl";
// import { useRouter } from "next/navigation";

// const LANGUAGES = [
//   { code: "en", label: "English", flag: "🇬🇧" },
//   { code: "bn", label: "বাংলা", flag: "🇧🇩" },
//   { code: "ar", label: "العربية", flag: "🇸🇦" },
// ];

// export default function LanguageSelector() {
//   const locale = useLocale();
//   const router = useRouter();

//   const handleChange = (newLocale: string) => {
//     // console.log("Changing to:", newLocale);
//     document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000`;

//     router.refresh();
//   };

//   return (
//     <select
//       value={locale}
//       onChange={(e) => handleChange(e.target.value)}
//       className="text-sm border border-gray-200 rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
//     >
//       {LANGUAGES.map((l) => (
//         <option key={l.code} value={l.code}>
//           {l.flag} {l.label}
//         </option>
//       ))}
//     </select>
//   );
// }

const LANGUAGES = [
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "bn", label: "বাংলা", flag: "🇧🇩" },
  { code: "ar", label: "العربية", flag: "🇸🇦" },
];

export default function LanguageSelector() {
  const locale = useLocale();
  const router = useRouter();

  const handleChange = (newLocale: string) => {
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000`;
    router.refresh();
  };

  return (
    <select
      value={locale}
      onChange={(e) => handleChange(e.target.value)}
      className="text-sm border border-gray-200 rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
    >
      {LANGUAGES.map((l) => (
        <option key={l.code} value={l.code}>
          {/* {l.flag} */}
          {l.label}
        </option>
      ))}
    </select>
  );
}
