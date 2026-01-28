import{r as f,j as e}from"./app-DRrHojaG.js";import{u as b}from"./useTranslation-DZairWB1.js";function w({label:d,placeholder:i,type:g="text",value:c,onChange:x,error:o,disabled:s=!1,required:u=!1,className:h="",icon:n}){const{t:p,i18n:m}=b(),[a,l]=f.useState(!1),r=m.language==="ar",t=!!o;return e.jsxs("div",{className:`relative ${h}`,children:[d&&e.jsxs("label",{className:`
                        block mb-2 text-sm font-semibold transition-colors duration-200
                        ${t?"text-red-600":a?"text-orange-600":"text-gray-700 dark:text-gray-300"}
                        ${r?"text-right arabic-font":"text-left"}
                    `,children:[d,u&&e.jsx("span",{className:"text-red-500 ml-1",children:"*"})]}),e.jsxs("div",{className:"relative",children:[n&&e.jsx("div",{className:`
                        absolute top-1/2 transform -translate-y-1/2 z-10
                        ${r?"right-4":"left-4"}
                        ${t?"text-red-500":a?"text-orange-600":"text-gray-400"}
                        transition-colors duration-200
                    `,children:n}),e.jsx("input",{type:g,placeholder:i,value:c,onChange:x,disabled:s,onFocus:()=>l(!0),onBlur:()=>l(!1),className:`
                        w-full h-12 px-4 py-3 text-sm font-medium
                        bg-white dark:bg-gray-800
                        border-2 rounded-xl
                        transition-all duration-300 ease-in-out
                        placeholder:text-gray-400 dark:placeholder:text-gray-500 placeholder:font-normal
                        ${n?r?"pr-12":"pl-12":""}
                        ${r?"text-right rtl":"text-left ltr"}
                        ${t?"border-red-400 bg-red-50 dark:bg-red-900/20 focus:border-red-500 focus:ring-4 focus:ring-red-100 dark:focus:ring-red-800/30 shadow-lg shadow-red-100 dark:shadow-red-900/20":s?"border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed dark:border-gray-600 dark:bg-gray-700":a?"border-orange-600 bg-orange-50 dark:bg-orange-900/20 focus:ring-4 focus:ring-orange-100 dark:focus:ring-orange-800/30 shadow-lg shadow-orange-100 dark:shadow-orange-900/20":"border-gray-300 dark:border-gray-600 hover:border-orange-600 hover:shadow-md hover:shadow-orange-100 dark:hover:shadow-orange-900/20"}
                        focus:outline-none
                        dark:text-white
                        transform hover:scale-[1.02] focus:scale-[1.02]
                    `}),a&&!t&&!s&&e.jsx("div",{className:"absolute inset-0 rounded-xl bg-gradient-to-r from-orange-500/10 to-orange-600/10 pointer-events-none animate-pulse"})]}),o&&e.jsxs("div",{className:`mt-2 flex items-center gap-2 ${r?"text-right flex-row-reverse":"text-left"}`,children:[e.jsx("svg",{className:"w-4 h-4 text-red-500 flex-shrink-0",fill:"currentColor",viewBox:"0 0 20 20",children:e.jsx("path",{fillRule:"evenodd",d:"M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z",clipRule:"evenodd"})}),e.jsx("p",{className:"text-red-600 text-sm font-medium",children:o})]})]})}export{w as C};
