export const locations = {
  regions: [
    {
      name: "Africa",
      subregions: [
        {
          name: "Eastern Africa",
          countries: [
            "Ethiopia",
            "Kenya",
            "Tanzania",
            "Uganda",
            "Rwanda",
            "Mozambique",
            "Madagascar",
            "Somalia",
            "Zimbabwe",
            "Zambia",
          ],
        },
        {
          name: "Northern Africa",
          countries: ["Egypt", "Morocco", "Tunisia", "Algeria", "Libya", "Sudan"],
        },
        {
          name: "Southern Africa",
          countries: ["South Africa", "Namibia", "Botswana", "Lesotho", "Swaziland"],
        },
        {
          name: "Western Africa",
          countries: ["Nigeria", "Ghana", "Ivory Coast", "Senegal", "Mali", "Burkina Faso", "Guinea", "Benin", "Togo"],
        },
        {
          name: "Central Africa",
          countries: ["Cameroon", "Congo", "Angola", "Chad", "Gabon", "Central African Republic"],
        },
      ],
    },
    {
      name: "Americas",
      subregions: [
        {
          name: "Northern America",
          countries: ["United States", "Canada"],
        },
        {
          name: "Caribbean",
          countries: [
            "Jamaica",
            "Cuba",
            "Haiti",
            "Dominican Republic",
            "Puerto Rico",
            "Bahamas",
            "Trinidad and Tobago",
            "Barbados",
          ],
        },
        {
          name: "Central America",
          countries: ["Mexico", "Costa Rica", "Panama", "Guatemala", "Honduras", "Nicaragua", "El Salvador", "Belize"],
        },
        {
          name: "South America",
          countries: [
            "Brazil",
            "Argentina",
            "Colombia",
            "Chile",
            "Peru",
            "Venezuela",
            "Ecuador",
            "Bolivia",
            "Paraguay",
            "Uruguay",
          ],
        },
      ],
    },
    {
      name: "Asia",
      subregions: [
        {
          name: "Eastern Asia",
          countries: ["China", "Japan", "South Korea", "North Korea", "Mongolia", "Taiwan", "Hong Kong", "Macau"],
        },
        {
          name: "South-Eastern Asia",
          countries: [
            "Singapore",
            "Indonesia",
            "Thailand",
            "Vietnam",
            "Philippines",
            "Malaysia",
            "Myanmar",
            "Cambodia",
            "Laos",
            "Brunei",
          ],
        },
        {
          name: "Southern Asia",
          countries: ["India", "Pakistan", "Bangladesh", "Sri Lanka", "Nepal", "Afghanistan", "Maldives", "Bhutan"],
        },
        {
          name: "Western Asia",
          countries: [
            "Israel",
            "Saudi Arabia",
            "UAE",
            "Turkey",
            "Qatar",
            "Kuwait",
            "Bahrain",
            "Oman",
            "Jordan",
            "Lebanon",
          ],
        },
        {
          name: "Central Asia",
          countries: ["Kazakhstan", "Uzbekistan", "Kyrgyzstan", "Tajikistan", "Turkmenistan"],
        },
      ],
    },
    {
      name: "Europe",
      subregions: [
        {
          name: "Eastern Europe",
          countries: [
            "Russia",
            "Poland",
            "Ukraine",
            "Romania",
            "Czech Republic",
            "Hungary",
            "Belarus",
            "Bulgaria",
            "Slovakia",
            "Moldova",
          ],
        },
        {
          name: "Northern Europe",
          countries: [
            "United Kingdom",
            "Sweden",
            "Norway",
            "Denmark",
            "Finland",
            "Ireland",
            "Lithuania",
            "Latvia",
            "Estonia",
            "Iceland",
          ],
        },
        {
          name: "Southern Europe",
          countries: [
            "Italy",
            "Spain",
            "Greece",
            "Portugal",
            "Croatia",
            "Serbia",
            "Albania",
            "Montenegro",
            "Macedonia",
            "Slovenia",
          ],
        },
        {
          name: "Western Europe",
          countries: [
            "Germany",
            "France",
            "Netherlands",
            "Belgium",
            "Switzerland",
            "Austria",
            "Luxembourg",
            "Monaco",
            "Liechtenstein",
          ],
        },
      ],
    },
    {
      name: "Oceania",
      subregions: [
        {
          name: "Australia and New Zealand",
          countries: ["Australia", "New Zealand"],
        },
        {
          name: "Melanesia",
          countries: ["Fiji", "Papua New Guinea", "Solomon Islands", "Vanuatu", "New Caledonia"],
        },
        {
          name: "Micronesia",
          countries: ["Guam", "Kiribati", "Marshall Islands", "Micronesia", "Nauru", "Palau"],
        },
        {
          name: "Polynesia",
          countries: ["Samoa", "Tonga", "French Polynesia", "Cook Islands", "American Samoa", "Niue"],
        },
      ],
    },
  ],
}

export const timeZones = [
  // UTC-12 to UTC-1
  { value: "utc-12", label: "(UTC-12:00) Baker Island Time" },
  { value: "utc-11", label: "(UTC-11:00) Niue Time, Samoa Standard Time" },
  { value: "utc-10", label: "(UTC-10:00) Hawaii-Aleutian Standard Time" },
  { value: "utc-9:30", label: "(UTC-09:30) Marquesas Islands Time" },
  { value: "utc-9", label: "(UTC-09:00) Alaska Standard Time" },
  { value: "utc-8", label: "(UTC-08:00) Pacific Time (US & Canada)" },
  { value: "utc-7", label: "(UTC-07:00) Mountain Time (US & Canada)" },
  { value: "utc-6", label: "(UTC-06:00) Central Time (US & Canada)" },
  { value: "utc-5", label: "(UTC-05:00) Eastern Time (US & Canada)" },
  { value: "utc-4", label: "(UTC-04:00) Atlantic Time (Canada)" },
  { value: "utc-3:30", label: "(UTC-03:30) Newfoundland Time" },
  { value: "utc-3", label: "(UTC-03:00) Argentina, Brazil" },
  { value: "utc-2", label: "(UTC-02:00) South Georgia Time" },
  { value: "utc-1", label: "(UTC-01:00) Azores Time" },

  // UTC+0 to UTC+14
  { value: "utc+0", label: "(UTC+00:00) Greenwich Mean Time" },
  { value: "utc+1", label: "(UTC+01:00) Central European Time" },
  { value: "utc+2", label: "(UTC+02:00) Eastern European Time" },
  { value: "utc+3", label: "(UTC+03:00) Moscow Time" },
  { value: "utc+3:30", label: "(UTC+03:30) Iran Time" },
  { value: "utc+4", label: "(UTC+04:00) Gulf Standard Time" },
  { value: "utc+4:30", label: "(UTC+04:30) Afghanistan Time" },
  { value: "utc+5", label: "(UTC+05:00) Pakistan Standard Time" },
  { value: "utc+5:30", label: "(UTC+05:30) India Standard Time" },
  { value: "utc+5:45", label: "(UTC+05:45) Nepal Time" },
  { value: "utc+6", label: "(UTC+06:00) Bangladesh Standard Time" },
  { value: "utc+6:30", label: "(UTC+06:30) Myanmar Time" },
  { value: "utc+7", label: "(UTC+07:00) Indochina Time" },
  { value: "utc+8", label: "(UTC+08:00) China Standard Time" },
  { value: "utc+8:45", label: "(UTC+08:45) Central Western Time (Australia)" },
  { value: "utc+9", label: "(UTC+09:00) Japan Standard Time" },
  { value: "utc+9:30", label: "(UTC+09:30) Australian Central Time" },
  { value: "utc+10", label: "(UTC+10:00) Australian Eastern Time" },
  { value: "utc+10:30", label: "(UTC+10:30) Lord Howe Time" },
  { value: "utc+11", label: "(UTC+11:00) Solomon Island Time" },
  { value: "utc+12", label: "(UTC+12:00) New Zealand Standard Time" },
  { value: "utc+12:45", label: "(UTC+12:45) Chatham Islands Time" },
  { value: "utc+13", label: "(UTC+13:00) Phoenix Islands Time" },
  { value: "utc+14", label: "(UTC+14:00) Line Islands Time" },
]

