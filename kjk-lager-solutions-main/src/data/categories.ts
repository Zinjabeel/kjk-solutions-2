export interface CategoryDef {
  slug: string;
  title: string;
  eyebrow: string;
  description: string;
  /** Match raw product category slugs or tags */
  matchSlugs: string[];
  matchTags?: string[];
}

export const CATEGORIES: CategoryDef[] = [
  {
    slug: "pallstall",
    title: "Pallställ",
    eyebrow: "Tunglast",
    description:
      "Robusta pallställ för EUR-pall och industripall. Nya City-system, tillbehör och begagnade moduler — modulärt, justerbart och certifierat.",
    matchSlugs: [
      "pallstall",
      "pallstall-city",
      "pallstallage",
      "pallstall-sektioner",
      "tillbehor-pallstall",
      "pallstall-tillbehor-begagnat",
      "tillbehor-pallstall-begagnat",
      "pallben",
      "pallkrage-tillbehor",
    ],
    matchTags: ["pallstall"],
  },
  {
    slug: "hyllstall",
    title: "Hyllställ",
    eyebrow: "Plocklager",
    description:
      "Lätta och tunga hyllställ för plock, arkiv och småkomponenter — galvade system, smådelslådor och begagnade hyllställ.",
    matchSlugs: [
      "hyllstall",
      "hyllstall-galvade",
      "hyllstall-med-smadelslador",
      "hyllstall-smagodshantering",
      "tillbehor-hyllstall",
      "hyllstall-begagnade",
      "hyllstall-hi280-begagnat",
      "hyllstall-s90-begagnat",
      "hyllstall-stemo-begagnat",
      "liststall",
      "liststall-begagnade",
    ],
    matchTags: ["hyllstall", "lagerhyllor"],
  },
  {
    slug: "grenstall",
    title: "Grenställ",
    eyebrow: "Långgods",
    description: "Grenställ för rör, stål, virke och andra långa gods — enkelsidiga och dubbelsidiga system.",
    matchSlugs: [
      "grenstall",
      "enkelsidigt-grenstall",
      "dubbelsidigt-grenstall",
      "mobila-grenstall",
      "tillbehor-tungt-grenstall",
      "langgodshantering",
    ],
    matchTags: ["grenstall"],
  },
  {
    slug: "entresolplan",
    title: "Entresol",
    eyebrow: "Volymvinst",
    description: "Entresolplan och mezzaniner som utnyttjar takhöjden — nya och begagnade lösningar.",
    matchSlugs: ["entresol", "entresoler-begagnade", "kompaktarkiv", "kompaktarkiv-begagnade"],
    matchTags: ["entresol"],
  },
  {
    slug: "arbetsplats",
    title: "Arbetsplats",
    eyebrow: "Verkstad & lager",
    description: "Arbetsbord, bänkar, skåp, stolar och kompletta arbetsstationer för lager och verkstad.",
    matchSlugs: [
      "arbetsplats",
      "arbetsbord",
      "arbetsbord-bankar",
      "arbetsbankar",
      "arbetsbord-begagnade",
      "begagnade-arbetsbord",
      "packbord",
      "motorbord",
      "arbetsbockar-pallar",
      "arbetskorgar",
      "verkstadsskap",
      "verktygsskap",
      "kladskap",
      "kontorsskap",
      "smafackskap",
      "lyftbord",
    ],
    matchTags: ["arbetsplats"],
  },
  {
    slug: "pallhantering",
    title: "Pallhantering",
    eyebrow: "Truck & vagn",
    description: "Pallstaplare, pallvagnar, gaffelvagnar, ledstaplare och palldragare för effektiv internlogistik.",
    matchSlugs: [
      "pallhantering",
      "pallstaplare",
      "palldragare",
      "pallvagnar",
      "gaffelvagnar-pallyftare",
      "ledstaplare",
      "pallburar",
    ],
    matchTags: ["pallhantering"],
  },
  {
    slug: "lagerlador",
    title: "Lagerlådor & backar",
    eyebrow: "Smådelsförvaring",
    description: "Stemo lagerlådor, plastbackar, lagerbackar och tillbehör — nya och begagnade.",
    matchSlugs: [
      "lagerlador",
      "lagerlador-o-backar",
      "stemo-lagerlador",
      "lagerlador-begagnade",
      "lagerbackar-begagnade",
      "plastlador-backar-begagnade",
      "smadelslador-begagnade",
      "backstall-montorsvagn",
      "skap-stall-for-plocklador",
    ],
    matchTags: ["lagerlador"],
  },
  {
    slug: "sakerhet",
    title: "Säkerhet & skydd",
    eyebrow: "Skydd & märkning",
    description: "Påkörningsskydd, rasskydd, stolpskydd och märksystem för en säker lagermiljö.",
    matchSlugs: ["pakorningsskydd", "rasskydd", "sakerhet-skydd", "marksysten", "marksysten-lagermarkning"],
    matchTags: ["sakerhet"],
  },
  {
    slug: "vagnar",
    title: "Vagnar",
    eyebrow: "Transport",
    description: "Montörsvagnar, backvagnar, plattformsvagnar och butiksvagnar.",
    matchSlugs: [
      "vagnar",
      "ovriga-vagnar",
      "montors-verktygsvagnar",
      "butiks-lagervagnar",
      "bordsvagnar-och-plattformsvagnar",
      "plattformsvagnar",
      "trallor-backvagnar",
      "serveringsvagnar",
    ],
  },
  {
    slug: "rullbanor",
    title: "Rullbanor",
    eyebrow: "Flöde",
    description: "Rullbanor och rullställ för effektiv godshantering i lager och produktion.",
    matchSlugs: ["rullbanor", "rullbanor-begagnade", "rollrack"],
  },
  {
    slug: "miljo",
    title: "Miljö & avfall",
    eyebrow: "Återvinning",
    description: "Tippcontainrar, miljöstationer och avfallshantering för lager och industri.",
    matchSlugs: ["miljo-o-avfall", "tippcontainrar"],
  },
  {
    slug: "stegar",
    title: "Stegar & ställningar",
    eyebrow: "Höjdarbete",
    description: "Lagerstegar, arbetsstegar och ställningar för säkert arbete i höjd.",
    matchSlugs: ["stegar-och-stallningar", "stallningar", "arbetstrappor-plattformar", "ovriga-stegar", "lagerstegar"],
  },
  {
    slug: "identifiera",
    title: "Identifiera ert ställ",
    eyebrow: "Typbestämning",
    description:
      "Guider och tekniska data för att identifiera pallställ och hyllställ — mått, profiler, tillverkare och historik.",
    matchSlugs: ["pallstall-typ-benamning", "hyllstall-typ", "identifiera-ert-stall"],
  },
];

export function getCategory(slug: string): CategoryDef | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}
