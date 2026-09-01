import { i as __toESM } from "../_runtime.mjs";
import { N as redirect, _ as Link, c as Scripts, f as createRouter, g as createRootRouteWithContext, h as createFileRoute, l as HeadContent, m as lazyRouteComponent, p as Outlet, u as useRouterState, v as useNavigate, y as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as Button } from "./button-CiauPzBb.mjs";
import { t as Route$21 } from "./alertes.desinscription-DnXsFs3p.mjs";
import { t as CURRENCIES } from "./trip-duration-Dr4Tuig8.mjs";
import { t as CITY_GUIDES } from "./city-guides-B563V5AS.mjs";
import { n as PRUNED_GUIDE_SLUGS, r as PRUNED_ROUTE_SLUGS, s as withoutPruned, t as PRUNED_COMPARISON_SLUGS } from "./pruned-pages-CLTc2P-L.mjs";
import { t as ResponsivePicture } from "./destination-images-C1720lZ9.mjs";
import { a as ROUTE_WHITELIST, f as routesFrom, i as INDEXED_LEGACY_SLUGS, r as DESTINATIONS, s as WHITELIST_VALIDATED_AT } from "./route-whitelist-w8ea1sr9.mjs";
import { i as absoluteUrl, n as SITE_NAME, r as SITE_URL, t as DEFAULT_OG_IMAGE } from "./site-wHW1AJjJ.mjs";
import { t as COMPARISONS } from "./comparisons-DzbgatmQ.mjs";
import { t as Route$22 } from "./comparatifs._slug-Bq1nTR6M.mjs";
import { A as ChevronDown, D as ChevronUp, L as BedDouble, a as Sun, g as Menu, j as Check, m as Moon, p as Plane } from "../_libs/lucide-react.mjs";
import { n as useCookieConsent, t as CookieConsentProvider } from "./cookie-consent-context-B4K0ucXm.mjs";
import { t as POSTS } from "./posts-Cx690dcB.mjs";
import { t as Route$23 } from "./conseils._slug-Ds51uonh.mjs";
import { t as TRAVEL_DOCUMENTS } from "./travel-documents-CkbhbaWQ.mjs";
import { t as Route$24 } from "./conseils.destinations._city-D3CwfRhV.mjs";
import { t as Route$25 } from "./conseils.destinations.index-ZBlg7vYD.mjs";
import { t as Route$26 } from "./conseils.formalites._pays-CLR-6u68.mjs";
import { t as render } from "../_libs/@react-email/render+[...].mjs";
import { t as TEMPLATES } from "./registry-B1PsKaw4.mjs";
import { t as FAQ } from "./faq-CfypCZv5.mjs";
import { n as useCurrency, t as CurrencyProvider } from "./currency-context-BjWSGzF3.mjs";
import { t as Route$27 } from "./mode-budget-BNbfUsiI.mjs";
import { n as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { t as Route$28 } from "./recherche-ws989BWm.mjs";
import { t as Toaster } from "../_libs/sonner.mjs";
import { n as Route$29 } from "./routes-Deo91hhv.mjs";
import { t as Route$30 } from "./vols._slug-C1lg0DY2.mjs";
import { a as SelectItemIndicator, c as SelectPortal, d as SelectSeparator$1, f as SelectTrigger$1, i as SelectItem$1, l as SelectScrollDownButton$1, m as SelectViewport, n as SelectContent$1, o as SelectItemText, p as SelectValue$1, r as SelectIcon, s as SelectLabel$1, t as Select$1, u as SelectScrollUpButton$1 } from "../_libs/@radix-ui/react-select+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-vlqe849l.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var styles_default = "/assets/styles-NctPJ3LM.css";
var logo_64_default$1 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAABPlBMVEVMaXFfmfdWm/T9/f3///3i7v8ug/Y4lPlKjvEsgvUxhfcwhfg5ifcwhfc1iPjw9v5goPcyhvg6iPJAj/g7i/Y0h/cuhPdRgOtJk/o3ifhAj/gvf+o0hvY1hvZ7sfo4i/nz9v0UZtgrg/dUmPQac+r6/f09jPiixfVsqfqUwvtan/rC3f3x9v+kzPwdffnq8/0ZbuIWZtRAhN7///8OZtqix/nD2fqHtPf+//////8ug/YuhPj9/f8uhPYwi//7/f4xhfcmfvYVZ9ohe/YsgvYQZNguiP7N4v3e6/2/2Povhvoqgfbn8f33+v7y+P8gdOg7ivZMlPcYdfVUmvlHkfWxz/nI3vqJuflDkv2exfuPvPokgv2py/gphf4oe+4XbOKjzv9yqvdrp/mXwPk1kP+Buv9gpv8hbtvX5/xzrfsz9YZLAAAAOHRSTlMADRT8/gP9AQP8m/Vg0Xf9/sYpVja55wcfrUNokaT+iE/42vxHLOz9v83003RugOC92L/TeLBzLwrg2OcAAAAJcEhZcwAACxIAAAsSAdLdfvwAAAOPSURBVFiF7VZpUyJJEC2g6eoGFFAUvHWca3dm7yMqa7q7qm9a7ltQdDxm1vn/f2Cj2lHZiAUa5stuhO/7e/kyK49C6BnP+L8CK4qCl6cryrcFxwgV1/f2SmgJD1gETxYOXpx5twdoYSOKgjAqreb5eLx/PM4sKICF9dj6Vvp2bOb87OmL2CIpYMFOFnY3PeOD3T2vwvBsNboBHFa9tLpyYpzIJh2Vy7VaZzMe1QAWweOZjbThUdk0r6vVoA6BF7GEWLCV7ZSwrsqO3QogOGcEvqhrEQRwaH0ttK6qMrWbNzW4OQcNyrep+Xz8ZF1VVZ2b5pcyZK96wBiMzMIcARxWfTu1aQjrVOcVu9Mn4B8HwDTInm7NriBOPlqXZUopd+yuyLzX9YERBr3K9lQDWFFEw8W+Vl3WdZ3rNh9lgcCgWwZGCJE+52dYRwJ/vj4T1nVB56Z5fQcM6rlWVvAZ+Mb6NAMKKma2NlJ/wN2xTbkIzh27EwBhUG7mamF8Jn1aSf57CbCCYhvG2dgwclVpVDE557rdHNZE3QPzSiMaIUSD6um0McIotmU03+RM1W4Gkt+yqensV4EwAjftAWiCT5j0ccoYYRQ/2Dwxu9rI5rxiDlhtoOd8IIxB/bo9BBbyCSQ+TxkjjEqptCerTd2hVKd2qy+VhXsG5Va798Bnkj99jDCK755wx6GUUt10hgAa0xgE3AzC8t0LfPpxRg9glOGCTvXKVVYEZRoMbS7a5x6aVH09axcqRbRqqKFAxweNMajtt7t3j3xRwtljhLGS90T36mZlUAcod9qd6hOfSOz7OXOsoHVPpToVDdzq90/bubD9Hg34qbmLKJn3VNHDOjdp47Jbn+ATBvuFeQIYbXMaTgHl+oVrvZkQ0KTqnDkWUNCucW9Bp7zhuucTJYSPLyNsIlTceFDgF5Zl9R4UNIm8nccWUFB85asC1S8t13poIyb5U+f4H1BQKW/Ioh0ov3At968+JIRAAr4rRjsGGMX2jA+hArWEwp1Q0KRsNAMo3Aw7aU91qKM3XMtyf/0NEiQB76KfQ6ygwoqhCgnLPWr8/ioLiQT8gMS2jawQD9PgDffocgcdJgj8FPkchsA4TENWLdd6idBhAt4vYGAiDbnhHq2hJHp1uBgd3S/ZlMEvrKN4eGuW+hKhTNq4/EU8fzK5zL8OK2gt7/28VPSnNHZ3Fv+PTeBbfqQTp/4Zz/jv42/lpcpAZPIFcgAAAABJRU5ErkJggg==";
var logo_64_default = "data:image/webp;base64,UklGRtQHAABXRUJQVlA4WAoAAAAQAAAAPwAAPwAAQUxQSEUCAAABoERbu2k7+v5/7xfbtm31nJRd1bJt27Zt27ZttWyb59//F2fvc3tpRcQEYHVsCaraQCGgkTUK0HK966/vB2kAiQrotFM/5v88FrF2IUDQf9+XE5n+41YI9dIoQNvN7viT9ColftQaUiOJAoRZZ39BpxlJ4wEIqKuEAGDwAW84mcxJ0vl1D0hNNArQafP7/yHdnMs3noKAOkoUoGn2xd/SaYkrdv4+AlpOQgAw7LB3SJo5V9Z4GRSlNQrQacsH/yW9cq688/+ppSQK0DT30u/ptMRVNt4OQUlRAMMPe5ekmTPrfIRcEhQa0GHzB/8lvXJmTXwC2UWx7L4/0GmJuRM3RcikaL7dHY9ffhdp5sye+GozSBaJaPcwE8mUWDJxGwTkQbub+X9llbFo4gdtIDkEnU/8kcbyxr0RkGfA5b8xeTHn510hWQBBl7OTeynjUQjIFRSbGws7f+wPyQVoEw5mKmM8BwEFRZpeYCrh/HMUtAQCNixjvByKwvoMLZ/z/2nFFPPcPZvxDghKK85glY2cj1BM0PIJVpkSn0QdFd3fZJVrU4QaQNH7BVa+Uu7LJL7eHFIHKNpcw5RWhu7L2QYB9RTFrn/TVpD45LtMTHy3NaQm0IhpH7Ly5VQ8aMhvTMY9EFBbieh4HVNaxrgz1viL/LQLpD6ACnb6k+akc01go3+4HwJqLRGT36M5WY1BxNQNIuouEe2vZDL+2hmigNQOUMU2v5MfNYdAYyNAAsa9xscBQaNKQJvztoeigVXQ6BKkwVaDBQBWUDggaAUAANAcAJ0BKkAAQAA+MRCFQqIhDf2oEAGCWwAzqecpN/AD2LKn/KfuXlA/Nt+T+6T3AeoD7ZvcA/Rf/O9QDzAfsB+2PYQ9AD9YfVV/zPsAegB+tPqhf3/9mfgN/Zv9rvgC/V//2dYBwgH2Ad+v9O/FD9o+oKPkvt/CDtWf4ressY7pTyiuMGjo/3XpHf4/9181/5V/Yv+b/gvgB/kX85/z/5095T0If1EcOWao5XqCrdsKy1VW4IRePufnBGSh0KcY27hV7LdfBgPJZFv6tjxB5Yh3mRBYZ9mEmP3ML6QS/M/HazBOOj9rv8MSoKK/NptAAP7/j7wUn/nGFdUCG6H4kS/Ep29TqjIfPwrtYhY8fnpR8YZ1HPvYeFn06JHDAwVIPpzaLu2W4BL3O/6yyx+m1ck2gu+yMiQ1ewSJXDamCLkaO5mH1KprXlmWa0eC+yVK7eQX/uVG0T0Z5nIhdYWzb5EnybtCmlz9L7xzLB+lDLjNF3Bmgvo3wCH1TIggAqAeOVFz8eq303ul96AFiAoTSbRoaV6oIyJexX6qr5PgHmHvvD+I6Er8RM2ZjWoiwWeZudzHCZxxL8YaXKCmWIedqkWmTUgVGWRrB0iZdj3Vzd//yk3SrOh8YJOKhvYWdN6U8vjV60FJOZ49NKJoEd9XUHZniH5C3X9Yi6rGc28Mz/lM/f7+Zj3ZNy4i8ckeL4IcbpcbjoN4bKofjWdv1vcL/eT5FgpLcjtS+d+HKaeV4ouu2egnX/aD2tdeyUOP9pQ70f8ih0/K8E+e0kzNiwY5W87GJA20irqubPsBYsMU/F17NeElXRhOp1/iO63EQkcZfEuMZzZvcd5f1qvNLttdpekI5DkEKQINz36R/+YHiySX6BHFUA3ieyqFHXexj6F3+M5UGtPUyMINgD5ZSywYPzrlrfItt7pzyptyxT8ax/hy2TXr8ZbTv1EP5McOxXrYverIM/kmb0tb0dyDh17Ded8xcLaZWfz8g0NmUOp5a87eH8xbX9FeJHTZEhZ88Zf5Q+tjUfTcTxLXrDaISfD7TujxTxib7PSVuaZ8c6bBCemD5eSwfelVfcVi5uCNE1NqW4C/ump93of8HM/FU7bqGjc2BUMN+Rd3dKU0C6oLo3sujVW4/4euTATtsXody/FlIoyeRoqxW9/bSRuQ/YlmJ0tHPMpa5fFd6CO1er4FvP/8W3oZX62vHbc9dn14WdjDTXOmkmWdm6ubvHGX75Z554RbuPyVX2vrsKcQRc13eFoxFqgF5YsMwEixQpkjcoPVL9yMwAhiLNnGGGleEX3uZOq/Qyq9TZ+E5oFe4yO0gMdFXHlGG0d0dsCPq47v0OgdNreWB8CMABb3n6np/n72pCAqo/5Ju9gHPR5t/O0WIr1VslZjRimLAl0w1tcBYmLBLvHccS7IjtPOm5TfNJjzCPUt6VxH1EIcd9dFi1wVJ8oKLZ8JZ6t7QoD6+TjKrYb/Pcl86cKXqK9TV2JEel+HLpfatijWD27sVf12clcuq4x9bOSDS4/bhn4VUx3Kky8lon/eVXJ8ZJIG72/zUrvSZZh2dyDAI3E8GW/tP//cvzkxYG55QZ/GptM8gBL9+auc2bZEU64azN2Uoe9lvLqvRCyjuZTUge65cY7MBKrSu7KwdDAF1yoYZd5ouYuDsVNRRdsH3KdV1gob/6WkbJAETtT7D92fzfSTrSoZ67t7rh8g8M0IbGjQrz3LXBORgWHzkz/BTvgDlpCfriJ56QUIuMx08Mv0Z6iV/rnEsS6len/mM/kVD1JVLei/UUvO//ounQUY7qCbos7AMDW4s4wzi7QEe0D8KJf/+mdt/EbzmHbsxYJASU7N0AA=";
var Select = Select$1;
var SelectValue = SelectValue$1;
var SelectTrigger = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectTrigger$1, {
	ref,
	className: cn("flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background cursor-pointer data-[placeholder]:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1", className),
	...props,
	children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectIcon, {
		asChild: true,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "h-4 w-4 opacity-50" })
	})]
}));
SelectTrigger.displayName = SelectTrigger$1.displayName;
var SelectScrollUpButton = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectScrollUpButton$1, {
	ref,
	className: cn("flex cursor-default items-center justify-center py-1", className),
	...props,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronUp, { className: "h-4 w-4" })
}));
SelectScrollUpButton.displayName = SelectScrollUpButton$1.displayName;
var SelectScrollDownButton = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectScrollDownButton$1, {
	ref,
	className: cn("flex cursor-default items-center justify-center py-1", className),
	...props,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "h-4 w-4" })
}));
SelectScrollDownButton.displayName = SelectScrollDownButton$1.displayName;
var SelectContent = import_react.forwardRef(({ className, children, position = "popper", ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectPortal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent$1, {
	ref,
	className: cn("relative z-50 max-h-(--radix-select-content-available-height) min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-select-content-transform-origin)", position === "popper" && "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1", className),
	position,
	...props,
	children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectScrollUpButton, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectViewport, {
			className: cn("p-1", position === "popper" && "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"),
			children
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectScrollDownButton, {})
	]
}) }));
SelectContent.displayName = SelectContent$1.displayName;
var SelectLabel = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectLabel$1, {
	ref,
	className: cn("px-2 py-1.5 text-sm font-semibold", className),
	...props
}));
SelectLabel.displayName = SelectLabel$1.displayName;
var SelectItem = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem$1, {
	ref,
	className: cn("relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50", className),
	...props,
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "absolute right-2 flex h-3.5 w-3.5 items-center justify-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItemIndicator, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4" }) })
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItemText, { children })]
}));
SelectItem.displayName = SelectItem$1.displayName;
var SelectSeparator = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectSeparator$1, {
	ref,
	className: cn("-mx-1 my-1 h-px bg-muted", className),
	...props
}));
SelectSeparator.displayName = SelectSeparator$1.displayName;
function CurrencySelect() {
	const { currency, setCurrency } = useCurrency();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
		value: currency,
		onValueChange: (value) => setCurrency(value),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
			className: "h-9 w-[88px] border-border bg-card text-sm sm:w-[104px]",
			"aria-label": "Choisir la devise d'affichage",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: CURRENCIES.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem, {
			value: c.code,
			children: [
				c.symbol,
				" ",
				c.code
			]
		}, c.code)) })]
	});
}
var ThemeContext = (0, import_react.createContext)(null);
var STORAGE_KEY = "tmv-theme";
function ThemeProvider({ children }) {
	const [theme, setThemeState] = (0, import_react.useState)("light");
	(0, import_react.useEffect)(() => {
		setThemeState(document.documentElement.classList.contains("dark") ? "dark" : "light");
	}, []);
	const toggleTheme = (0, import_react.useCallback)(() => {
		setThemeState((prev) => {
			const next = prev === "dark" ? "light" : "dark";
			document.documentElement.classList.toggle("dark", next === "dark");
			try {
				window.localStorage.setItem(STORAGE_KEY, next);
			} catch {}
			return next;
		});
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThemeContext.Provider, {
		value: {
			theme,
			toggleTheme
		},
		children
	});
}
function useTheme() {
	const ctx = (0, import_react.useContext)(ThemeContext);
	if (!ctx) return {
		theme: "light",
		toggleTheme: () => {}
	};
	return ctx;
}
function ThemeToggle() {
	const { theme, toggleTheme } = useTheme();
	const isDark = theme === "dark";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
		type: "button",
		variant: "outline",
		size: "icon",
		className: "h-9 w-9 shrink-0 border-border bg-card",
		onClick: toggleTheme,
		"aria-label": isDark ? "Passer en mode clair" : "Passer en mode sombre",
		children: isDark ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sun, {
			className: "size-4",
			"aria-hidden": true
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Moon, {
			className: "size-4",
			"aria-hidden": true
		})
	});
}
var NAV = [
	{
		to: "/mode-budget",
		label: "Mode budget",
		search: {
			origin: "PAR",
			budget: 400,
			month: ""
		}
	},
	{
		to: "/conseils/destinations",
		label: "Guides destinations"
	},
	{
		to: "/conseils",
		label: "Conseils"
	},
	{
		to: "/faq",
		label: "FAQ"
	},
	{
		to: "/contact",
		label: "Contact"
	}
];
function Header() {
	const [open, setOpen] = (0, import_react.useState)(false);
	const navigate = useNavigate();
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	/** Scroll vers le formulaire de recherche et focus sur le champ départ. */
	const focusSearchForm = (0, import_react.useCallback)(() => {
		document.getElementById("recherche")?.scrollIntoView({
			behavior: "smooth",
			block: "start"
		});
		const firstField = document.getElementById("origin");
		if (firstField instanceof HTMLElement) window.setTimeout(() => firstField.focus({ preventScroll: true }), 350);
	}, []);
	const onCtaClick = (0, import_react.useCallback)(() => {
		setOpen(false);
		if (pathname === "/") {
			focusSearchForm();
			return;
		}
		navigate({ to: "/" }).then(() => {
			window.setTimeout(focusSearchForm, 300);
		});
	}, [
		pathname,
		navigate,
		focusSearchForm
	]);
	/**
	* Si la page courante contient déjà un widget d'hébergement Stay22, on scrolle vers lui.
	* Sinon on redirige vers la page dédiée /hebergement.
	*/
	const onStayClick = (0, import_react.useCallback)(() => {
		setOpen(false);
		const section = document.getElementById("hebergement");
		if (section) {
			section.scrollIntoView({
				behavior: "smooth",
				block: "start"
			});
			return;
		}
		navigate({ to: "/hebergement" });
	}, [navigate]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: "sticky top-0 z-40 border-b border-border/70 bg-background/90 backdrop-blur",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "container-page flex h-16 items-center justify-between gap-2 sm:gap-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/",
					className: "flex shrink-0 items-center gap-1.5 whitespace-nowrap font-display text-base font-semibold sm:gap-2 sm:text-lg",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsivePicture, {
						src: logo_64_default$1,
						webp: logo_64_default,
						alt: "TrouveMonVol",
						width: 40,
						height: 40,
						className: "size-9 shrink-0 rounded-lg object-contain dark:drop-shadow-[0_0_8px_rgba(59,130,246,0.45)] sm:size-10"
					}), "TrouveMonVol"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
					className: "hidden items-center gap-1 lg:flex",
					"aria-label": "Navigation principale",
					children: [
						NAV.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: item.to,
							search: "search" in item ? item.search : {},
							className: "whitespace-nowrap rounded-md px-2 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground xl:px-3",
							activeProps: { className: "bg-secondary text-foreground" },
							children: item.label
						}, item.to)),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							onClick: onStayClick,
							"aria-label": "Trouver un hébergement",
							className: "ml-2 hidden gap-1.5 whitespace-nowrap xl:flex",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BedDouble, {
								className: "size-4",
								"aria-hidden": true
							}), "Hébergement"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							onClick: onCtaClick,
							className: "ml-1 gap-1.5 whitespace-nowrap shadow-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plane, {
								className: "size-4",
								"aria-hidden": true
							}), "Trouve mon vol"]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex shrink-0 items-center gap-1.5 sm:gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThemeToggle, {}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CurrencySelect, {}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							size: "icon",
							className: "lg:hidden",
							"aria-label": "Ouvrir le menu",
							"aria-expanded": open,
							onClick: () => setOpen((v) => !v),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, {
								className: "size-4",
								"aria-hidden": true
							})
						})
					]
				})
			]
		}), open && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
			className: "border-t border-border bg-card lg:hidden",
			"aria-label": "Navigation mobile",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "container-page flex flex-col py-2",
				children: [
					NAV.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: item.to,
						search: "search" in item ? item.search : {},
						onClick: () => setOpen(false),
						className: "rounded-md px-2 py-3 text-sm font-medium text-foreground",
						children: item.label
					}, item.to)),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						onClick: onStayClick,
						className: "mx-2 mb-2 mt-1 gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BedDouble, {
							className: "size-4",
							"aria-hidden": true
						}), "Trouver un hébergement"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						onClick: onCtaClick,
						className: "mx-2 mb-2 gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plane, {
							className: "size-4",
							"aria-hidden": true
						}), "Trouve mon vol"]
					})
				]
			})
		})]
	});
}
var linkClass = "transition-colors hover:text-foreground";
/**
* Les liaisons Marseille les mieux desservies, mesurées par le nombre d'offres
* réellement renvoyées par l'API lors de la validation de la liste blanche.
*/
var MARSEILLE_FOOTER_ROUTES = [...routesFrom("MRS")].sort((a, b) => b.validation.offers - a.validation.offers).slice(0, 6);
function Footer() {
	const year = (/* @__PURE__ */ new Date()).getFullYear();
	const { openManager } = useCookieConsent();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
		className: "mt-20 border-t border-border bg-secondary/40",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "container-page grid gap-10 py-12 md:grid-cols-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsivePicture, {
							src: logo_64_default$1,
							webp: logo_64_default,
							alt: "TrouveMonVol",
							width: 32,
							height: 32,
							loading: "lazy",
							className: "size-8 shrink-0"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display text-lg font-semibold",
							children: "TrouveMonVol"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm font-medium",
						children: "Le comparateur de vols transparent"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 max-w-sm text-sm text-muted-foreground",
						children: "Prix total taxes incluses, vendeur réel affiché sur chaque résultat, sans faux compte à rebours ni classement payant."
					})
				] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-semibold",
						children: "Au départ de Marseille"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
						className: "mt-3 space-y-2 text-sm text-muted-foreground",
						children: [MARSEILLE_FOOTER_ROUTES.map((route) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/vols/$slug",
							params: { slug: route.slug },
							className: linkClass,
							children: ["Marseille — ", route.destinationCity]
						}) }, route.slug)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/mode-budget",
							search: {
								origin: "MRS",
								budget: 400,
								month: "",
								adultes: 1,
								enfants: 0,
								bebes: 0
							},
							className: `${linkClass} font-medium`,
							children: "Toutes les destinations depuis Marseille"
						}) })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-6 text-sm font-semibold",
						children: "Au départ de Paris"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-3 space-y-2 text-sm text-muted-foreground",
						children: withoutPruned(DESTINATIONS, PRUNED_ROUTE_SLUGS).slice(0, 4).map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/vols/$slug",
							params: { slug: d.slug },
							className: linkClass,
							children: [
								d.originCity,
								" — ",
								d.destinationCity
							]
						}) }, d.slug))
					})
				] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm font-semibold",
					children: "Explorer"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
					className: "mt-3 space-y-2 text-sm text-muted-foreground",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/mode-budget",
							search: {
								origin: "PAR",
								budget: 400,
								month: "",
								adultes: 1,
								enfants: 0,
								bebes: 0
							},
							className: linkClass,
							children: "Mode budget"
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/hebergement",
							className: linkClass,
							children: "Trouver un hébergement"
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/conseils",
							className: linkClass,
							children: "Blog conseils voyage"
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/comparatifs",
							className: linkClass,
							children: "Comparatifs de destinations"
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/conseils/formalites",
							className: linkClass,
							children: "Visa et formalités par pays"
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/faq",
							className: linkClass,
							children: "Questions fréquentes (FAQ)"
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/indemnisation",
							className: linkClass,
							children: "Vol retardé ou annulé"
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/contact",
							className: linkClass,
							children: "Contact & newsletter"
						}) })
					]
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm font-semibold",
					children: "Informations légales"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
					className: "mt-3 space-y-2 text-sm text-muted-foreground",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/mentions-legales",
							className: linkClass,
							children: "Mentions légales"
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/cgu",
							className: linkClass,
							children: "Conditions générales d'utilisation"
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/confidentialite",
							className: linkClass,
							children: "Politique de confidentialité"
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/cookies",
							className: linkClass,
							children: "Cookies"
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: openManager,
							className: `${linkClass} cursor-pointer text-left`,
							children: "Gérer mes cookies"
						}) })
					]
				})] })
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "container-page space-y-2 border-t border-border py-6 text-xs text-muted-foreground",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Prix indicatifs fournis par nos partenaires de distribution, taxes incluses. Nous touchons une commission d'affiliation si vous réservez — sans que cela change le prix que vous payez." }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
				"© ",
				year,
				" TrouveMonVol — Tous droits réservés."
			] })]
		})]
	});
}
/**
* Bandeau + gestionnaire de consentement cookies (RGPD/ePrivacy, recommandations
* CNIL) : "Refuser" a la même taille et le même niveau de visibilité que
* "Accepter", et rien de non essentiel n'est chargé tant qu'aucun choix n'a
* été fait (voir useMapsConsent, consommé par Stay22Map et __root.tsx).
*/
function CookieBanner() {
	const { managerOpen, consent, acceptAll, rejectAll, savePreferences, closeManager } = useCookieConsent();
	const [expanded, setExpanded] = (0, import_react.useState)(false);
	const [mapsDraft, setMapsDraft] = (0, import_react.useState)(consent?.maps ?? false);
	if (!managerOpen) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		role: "region",
		"aria-label": "Gestion du consentement aux cookies",
		className: "fixed inset-x-0 bottom-0 z-50 border-t border-border bg-card/98 shadow-[0_-4px_24px_rgba(0,0,0,0.12)] backdrop-blur",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "container-page max-w-3xl py-4 sm:py-5",
			children: !expanded ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-sm text-muted-foreground",
				children: [
					"TrouveMonVol utilise des cookies strictement nécessaires au fonctionnement du site (toujours actifs), et des cookies tiers optionnels pour afficher les cartes d'hébergement Stay22. Ces derniers ne sont chargés qu'avec votre accord.",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/cookies",
						className: "underline underline-offset-2 hover:text-foreground",
						children: "En savoir plus"
					}),
					"."
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 flex flex-wrap gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: acceptAll,
						size: "sm",
						className: "min-w-32",
						children: "Accepter"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: rejectAll,
						variant: "outline",
						size: "sm",
						className: "min-w-32",
						children: "Refuser"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: () => setExpanded(true),
						variant: "ghost",
						size: "sm",
						children: "Personnaliser"
					})
				]
			})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm font-semibold",
					children: "Personnaliser les cookies"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-3 space-y-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start justify-between gap-4 rounded-lg border border-border p-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-medium",
							children: "Nécessaires"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-0.5 text-xs text-muted-foreground",
							children: "Devise et thème choisis, mémorisation de vos préférences de cookies. Ne peuvent pas être désactivés."
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							"aria-hidden": true,
							className: "mt-0.5 inline-flex h-6 w-11 shrink-0 items-center rounded-full bg-primary/40 px-0.5",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-5 translate-x-5 rounded-full bg-primary" })
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex cursor-pointer items-start justify-between gap-4 rounded-lg border border-border p-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block text-sm font-medium",
							children: "Cartes d'hébergement (Stay22)"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mt-0.5 block text-xs text-muted-foreground",
							children: "Cartes interactives des hôtels sur la page Hébergement et les guides destination, fournies par notre partenaire Stay22."
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "mt-0.5 inline-flex shrink-0 items-center",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "checkbox",
								checked: mapsDraft,
								onChange: (e) => setMapsDraft(e.target.checked),
								className: "sr-only"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								"aria-hidden": true,
								className: `inline-flex h-6 w-11 items-center rounded-full px-0.5 transition-colors ${mapsDraft ? "bg-primary/40" : "bg-secondary"}`,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `size-5 rounded-full bg-primary transition-transform ${mapsDraft ? "translate-x-5" : "translate-x-0"}` })
							})]
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 flex flex-wrap gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							onClick: () => savePreferences({ maps: mapsDraft }),
							size: "sm",
							className: "min-w-32",
							children: "Enregistrer mes choix"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							onClick: acceptAll,
							variant: "outline",
							size: "sm",
							children: "Tout accepter"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							onClick: rejectAll,
							variant: "outline",
							size: "sm",
							children: "Tout refuser"
						}),
						consent && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							onClick: closeManager,
							variant: "ghost",
							size: "sm",
							children: "Annuler"
						})
					]
				})
			] })
		})
	});
}
var Toaster$1 = ({ ...props }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
		className: "toaster group",
		toastOptions: { classNames: {
			toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
			description: "group-[.toast]:text-muted-foreground",
			actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
			cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
		} },
		...props
	});
};
function reportLovableError(error, context = {}) {
	if (typeof window === "undefined") return;
	window.__lovableEvents?.captureException?.(error, {
		source: "react_error_boundary",
		route: window.location.pathname,
		...context
	}, {
		mechanism: "react_error_boundary",
		handled: false,
		severity: "error"
	});
	const message = error instanceof Response ? `Response ${error.status}${error.url ? ` at ${error.url}` : ""}` : error instanceof Error ? error.message : String(error);
	const stack = error instanceof Error ? error.stack : void 0;
	window.__lovableReportRuntimeError?.({
		message,
		...stack !== void 0 && { stack },
		filename: window.location.pathname
	});
}
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-7xl font-bold text-foreground",
					children: "404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 text-xl font-semibold text-foreground",
					children: "Page introuvable"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "La page que vous cherchez n'existe pas ou a été déplacée."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Retour à l'accueil"
					})
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error("Erreur de rendu client (ErrorComponent racine)", error);
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		reportLovableError(error, { boundary: "tanstack_root_error_component" });
	}, [error]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-semibold tracking-tight text-foreground",
					children: "Cette page n'a pas pu se charger"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Une erreur est survenue de notre côté. Essayez de recharger la page ou retournez à l'accueil."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Réessayer"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
						children: "Retour à l'accueil"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", {
					className: "mt-6 text-left text-xs text-muted-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("summary", {
						className: "cursor-pointer text-center",
						children: "Détails techniques"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("pre", {
						className: "mt-2 max-h-[40vh] overflow-auto whitespace-pre-wrap break-words rounded-md bg-secondary p-3",
						children: [error.message, error.stack ? `\n\n${error.stack.slice(0, 1200)}` : ""]
					})]
				})
			]
		})
	});
}
var Route$20 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{
				name: "author",
				content: "TrouveMonVol"
			},
			{
				name: "google-site-verification",
				content: "KKsNIWH1YJpMl4i0VxQsvpNVUQ_j43QbYM3GIkAHD4g"
			},
			{
				name: "theme-color",
				content: "#1b6fd0"
			},
			{
				name: "apple-mobile-web-app-title",
				content: "TrouveMonVol"
			},
			{
				name: "apple-mobile-web-app-capable",
				content: "yes"
			},
			{
				name: "apple-mobile-web-app-status-bar-style",
				content: "default"
			},
			{
				name: "application-name",
				content: "TrouveMonVol"
			},
			{
				name: "mobile-web-app-capable",
				content: "yes"
			},
			{
				property: "og:site_name",
				content: "TrouveMonVol"
			},
			{
				property: "og:locale",
				content: "fr_FR"
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			}
		],
		links: [
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "icon",
				href: "/favicon.png",
				type: "image/png",
				sizes: "32x32"
			},
			{
				rel: "icon",
				href: "/icons/icon-16.png",
				type: "image/png",
				sizes: "16x16"
			},
			{
				rel: "icon",
				href: "/icons/icon-48.png",
				type: "image/png",
				sizes: "48x48"
			},
			{
				rel: "icon",
				href: "/icons/icon-192.png",
				type: "image/png",
				sizes: "192x192"
			},
			{
				rel: "icon",
				href: "/icons/icon-512.png",
				type: "image/png",
				sizes: "512x512"
			},
			{
				rel: "apple-touch-icon",
				href: "/apple-touch-icon.png",
				sizes: "180x180"
			},
			{
				rel: "manifest",
				href: "/manifest.webmanifest"
			}
		],
		scripts: [{ children: "(function(){try{var t=localStorage.getItem('tmv-theme');var d=t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme: dark)').matches);if(d)document.documentElement.classList.add('dark');}catch(e){}})();" }, {
			type: "application/ld+json",
			children: JSON.stringify({
				"@context": "https://schema.org",
				"@type": "Organization",
				name: SITE_NAME,
				url: SITE_URL,
				logo: absoluteUrl("/icons/icon-512.png"),
				description: "Comparateur de vols transparent : prix total taxes incluses et vendeur réel affiché sur chaque résultat."
			})
		}]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "fr",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
function RootComponent() {
	const { queryClient } = Route$20.useRouteContext();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QueryClientProvider, {
		client: queryClient,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThemeProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CurrencyProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CookieConsentProvider, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex min-h-screen flex-col",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
						className: "flex-1",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CookieBanner, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster$1, {})
		] }) }) })
	});
}
var $$splitComponentImporter$12 = () => import("./cgu-b01RDBu9.mjs");
var TITLE$10 = "Conditions générales d'utilisation | TrouveMonVol";
var DESCRIPTION$10 = "Règles d'utilisation du comparateur de vols TrouveMonVol : rôle du site, responsabilités, alertes prix et données.";
var Route$19 = createFileRoute("/cgu")({
	head: () => ({
		meta: [
			{ title: TITLE$10 },
			{
				name: "description",
				content: DESCRIPTION$10
			},
			{
				name: "robots",
				content: "noindex, follow"
			},
			{
				property: "og:title",
				content: TITLE$10
			},
			{
				property: "og:description",
				content: DESCRIPTION$10
			},
			{
				property: "og:url",
				content: `${SITE_URL}/cgu`
			},
			{
				property: "og:image",
				content: DEFAULT_OG_IMAGE
			},
			{
				name: "twitter:image",
				content: DEFAULT_OG_IMAGE
			}
		],
		links: [{
			rel: "canonical",
			href: `${SITE_URL}/cgu`
		}]
	}),
	component: lazyRouteComponent($$splitComponentImporter$12, "component")
});
var $$splitComponentImporter$11 = () => import("./confidentialite-B-l6_gtD.mjs");
var TITLE$9 = "Politique de confidentialité | TrouveMonVol";
var DESCRIPTION$9 = "Quelles données TrouveMonVol collecte, pourquoi, combien de temps, et comment exercer vos droits.";
var Route$18 = createFileRoute("/confidentialite")({
	head: () => ({
		meta: [
			{ title: TITLE$9 },
			{
				name: "description",
				content: DESCRIPTION$9
			},
			{
				name: "robots",
				content: "noindex, follow"
			},
			{
				property: "og:title",
				content: TITLE$9
			},
			{
				property: "og:description",
				content: DESCRIPTION$9
			},
			{
				property: "og:url",
				content: `${SITE_URL}/confidentialite`
			},
			{
				property: "og:image",
				content: DEFAULT_OG_IMAGE
			},
			{
				name: "twitter:image",
				content: DEFAULT_OG_IMAGE
			}
		],
		links: [{
			rel: "canonical",
			href: `${SITE_URL}/confidentialite`
		}]
	}),
	component: lazyRouteComponent($$splitComponentImporter$11, "component")
});
var $$splitComponentImporter$10 = () => import("./contact-DyRVUiad.mjs");
var TITLE$8 = "Contact et newsletter | TrouveMonVol";
var DESCRIPTION$8 = "Contactez l'équipe TrouveMonVol à contact@trouvemonvol.fr et inscrivez-vous à la newsletter pour recevoir nos bons plans vols et guides de voyage.";
var Route$17 = createFileRoute("/contact")({
	head: () => ({
		meta: [
			{ title: TITLE$8 },
			{
				name: "description",
				content: DESCRIPTION$8
			},
			{
				property: "og:title",
				content: TITLE$8
			},
			{
				property: "og:description",
				content: DESCRIPTION$8
			},
			{
				property: "og:url",
				content: `${SITE_URL}/contact`
			},
			{
				property: "og:image",
				content: DEFAULT_OG_IMAGE
			},
			{
				name: "twitter:image",
				content: DEFAULT_OG_IMAGE
			}
		],
		links: [{
			rel: "canonical",
			href: `${SITE_URL}/contact`
		}],
		scripts: [{
			type: "application/ld+json",
			children: JSON.stringify({
				"@context": "https://schema.org",
				"@type": "ContactPage",
				name: TITLE$8,
				url: `${SITE_URL}/contact`,
				description: DESCRIPTION$8,
				mainEntity: {
					"@type": "Organization",
					name: "TrouveMonVol",
					url: SITE_URL,
					email: "contact@trouvemonvol.fr"
				}
			})
		}]
	}),
	component: lazyRouteComponent($$splitComponentImporter$10, "component")
});
var $$splitComponentImporter$9 = () => import("./cookies-CFmm8upQ.mjs");
var TITLE$7 = "Gestion des cookies | TrouveMonVol";
var DESCRIPTION$7 = "Quels cookies TrouveMonVol utilise, à quoi ils servent et comment modifier votre choix à tout moment.";
var Route$16 = createFileRoute("/cookies")({
	head: () => ({
		meta: [
			{ title: TITLE$7 },
			{
				name: "description",
				content: DESCRIPTION$7
			},
			{
				name: "robots",
				content: "noindex, follow"
			},
			{
				property: "og:title",
				content: TITLE$7
			},
			{
				property: "og:description",
				content: DESCRIPTION$7
			},
			{
				property: "og:url",
				content: `${SITE_URL}/cookies`
			},
			{
				property: "og:image",
				content: DEFAULT_OG_IMAGE
			},
			{
				name: "twitter:image",
				content: DEFAULT_OG_IMAGE
			}
		],
		links: [{
			rel: "canonical",
			href: `${SITE_URL}/cookies`
		}]
	}),
	component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
var $$splitComponentImporter$8 = () => import("./destinations-proposes-CFFFBx77.mjs");
var Route$15 = createFileRoute("/destinations-proposes")({
	head: () => ({ meta: [
		{ title: "Destinations proposées — TrouveMonVol" },
		{
			name: "description",
			content: "Page interne : liste des villes pour lesquelles un guide conseils doit être rédigé, avec génération et publication du brouillon."
		},
		{
			name: "robots",
			content: "noindex, nofollow"
		},
		{
			property: "og:title",
			content: "Destinations proposées — TrouveMonVol"
		},
		{
			property: "og:description",
			content: "Pilotage interne des guides destinations à rédiger."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
var $$splitComponentImporter$7 = () => import("./faq-M2vlw73m.mjs");
var TITLE$6 = "Questions fréquentes sur TrouveMonVol | comparateur de vols";
var DESCRIPTION$6 = "Comment fonctionne TrouveMonVol, pourquoi un prix peut changer, qui vend réellement le billet et comment marchent les alertes prix par email.";
var Route$14 = createFileRoute("/faq")({
	head: () => ({
		meta: [
			{ title: TITLE$6 },
			{
				name: "description",
				content: DESCRIPTION$6
			},
			{
				property: "og:title",
				content: TITLE$6
			},
			{
				property: "og:description",
				content: DESCRIPTION$6
			},
			{
				property: "og:url",
				content: `${SITE_URL}/faq`
			},
			{
				property: "og:image",
				content: DEFAULT_OG_IMAGE
			},
			{
				name: "twitter:image",
				content: DEFAULT_OG_IMAGE
			}
		],
		links: [{
			rel: "canonical",
			href: `${SITE_URL}/faq`
		}],
		scripts: [{
			type: "application/ld+json",
			children: JSON.stringify({
				"@context": "https://schema.org",
				"@type": "FAQPage",
				name: TITLE$6,
				url: `${SITE_URL}/faq`,
				inLanguage: "fr-FR",
				mainEntity: FAQ.map((item) => ({
					"@type": "Question",
					name: item.question,
					acceptedAnswer: {
						"@type": "Answer",
						text: item.answer
					}
				}))
			})
		}, {
			type: "application/ld+json",
			children: JSON.stringify({
				"@context": "https://schema.org",
				"@type": "BreadcrumbList",
				itemListElement: [{
					"@type": "ListItem",
					position: 1,
					name: "Accueil",
					item: `${SITE_URL}/`
				}, {
					"@type": "ListItem",
					position: 2,
					name: "FAQ",
					item: `${SITE_URL}/faq`
				}]
			})
		}]
	}),
	component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
var $$splitComponentImporter$6 = () => import("./hebergement-7_zSKj7h.mjs");
var TITLE$5 = "Trouver un hébergement — hôtels et locations sur une carte | TrouveMonVol";
var DESCRIPTION$5 = "Cherchez un hôtel, un appartement ou une auberge dans la ville de votre choix, affichés sur une carte interactive avec leurs prix, même sans avoir encore réservé de vol.";
var Route$13 = createFileRoute("/hebergement")({
	head: () => ({
		meta: [
			{ title: TITLE$5 },
			{
				name: "description",
				content: DESCRIPTION$5
			},
			{
				property: "og:title",
				content: TITLE$5
			},
			{
				property: "og:description",
				content: DESCRIPTION$5
			},
			{
				property: "og:url",
				content: `${SITE_URL}/hebergement`
			},
			{
				property: "og:image",
				content: DEFAULT_OG_IMAGE
			},
			{
				name: "twitter:image",
				content: DEFAULT_OG_IMAGE
			}
		],
		links: [{
			rel: "canonical",
			href: `${SITE_URL}/hebergement`
		}]
	}),
	component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
var $$splitComponentImporter$5 = () => import("./indemnisation-4Mz57oWd.mjs");
var TITLE$4 = "Vol retardé ou annulé : vos droits à indemnisation | TrouveMonVol";
var DESCRIPTION$4 = "Retard, annulation, refus d'embarquement : dans quels cas un vol au départ ou à destination de l'UE ouvre droit à une indemnisation, et comment faire la demande.";
var Route$12 = createFileRoute("/indemnisation")({
	head: () => ({
		meta: [
			{ title: TITLE$4 },
			{
				name: "description",
				content: DESCRIPTION$4
			},
			{
				property: "og:title",
				content: TITLE$4
			},
			{
				property: "og:description",
				content: DESCRIPTION$4
			},
			{
				property: "og:url",
				content: `${SITE_URL}/indemnisation`
			},
			{
				property: "og:image",
				content: DEFAULT_OG_IMAGE
			},
			{
				name: "twitter:image",
				content: DEFAULT_OG_IMAGE
			}
		],
		links: [{
			rel: "canonical",
			href: `${SITE_URL}/indemnisation`
		}],
		scripts: [{
			type: "application/ld+json",
			children: JSON.stringify({
				"@context": "https://schema.org",
				"@type": "BreadcrumbList",
				itemListElement: [{
					"@type": "ListItem",
					position: 1,
					name: "Accueil",
					item: `${SITE_URL}/`
				}, {
					"@type": "ListItem",
					position: 2,
					name: "Indemnisation vol retardé ou annulé",
					item: `${SITE_URL}/indemnisation`
				}]
			})
		}]
	}),
	component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
var $$splitComponentImporter$4 = () => import("./mentions-legales-NwQMAJM5.mjs");
var TITLE$3 = "Mentions légales | TrouveMonVol";
var DESCRIPTION$3 = "Éditeur, hébergeur et informations légales du comparateur de vols TrouveMonVol.";
var Route$11 = createFileRoute("/mentions-legales")({
	head: () => ({
		meta: [
			{ title: TITLE$3 },
			{
				name: "description",
				content: DESCRIPTION$3
			},
			{
				name: "robots",
				content: "noindex, follow"
			},
			{
				property: "og:title",
				content: TITLE$3
			},
			{
				property: "og:description",
				content: DESCRIPTION$3
			},
			{
				property: "og:url",
				content: `${SITE_URL}/mentions-legales`
			},
			{
				property: "og:image",
				content: DEFAULT_OG_IMAGE
			},
			{
				name: "twitter:image",
				content: DEFAULT_OG_IMAGE
			}
		],
		links: [{
			rel: "canonical",
			href: `${SITE_URL}/mentions-legales`
		}]
	}),
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
/**
* Date de dernière modification réelle des pages qui n'en portent pas dans
* leurs données.
*
* FICHIER GÉNÉRÉ : ne pas éditer à la main.
* Régénérer avec `node scripts/refresh-page-lastmod.mjs`.
*
* Les dates viennent de l'historique Git — la seule date de modification
* vérifiable dont nous disposons. Elles ne bougent que quand le contenu bouge,
* à la différence d'une date de génération qui changerait à chaque déploiement
* et signalerait du contenu automatisé plutôt que de la fraîcheur.
*
* Guides, articles, comparatifs et fiches formalités n'y figurent pas : ils
* portent déjà un champ `updated` tenu à la main.
*/
var PAGE_LASTMOD = {
	"/": "2026-09-01",
	"/comparatifs": "2026-09-01",
	"/conseils": "2026-09-01",
	"/conseils/destinations": "2026-09-01",
	"/conseils/formalites": "2026-09-01",
	"/contact": "2026-08-31",
	"/faq": "2026-09-01",
	"/hebergement": "2026-08-31",
	"/indemnisation": "2026-09-01",
	"/mode-budget": "2026-09-01",
	"/vols/lyon-tunis": "2026-09-01",
	"/vols/paris-alger": "2026-09-01",
	"/vols/paris-amsterdam": "2026-09-01",
	"/vols/paris-athenes": "2026-09-01",
	"/vols/paris-bali": "2026-09-01",
	"/vols/paris-bangkok": "2026-09-01",
	"/vols/paris-barcelone": "2026-09-01",
	"/vols/paris-berlin": "2026-09-01",
	"/vols/paris-birmingham": "2026-09-01",
	"/vols/paris-budapest": "2026-09-01",
	"/vols/paris-casablanca": "2026-09-01",
	"/vols/paris-copenhague": "2026-09-01",
	"/vols/paris-dakar": "2026-09-01",
	"/vols/paris-doha": "2026-09-01",
	"/vols/paris-dubai": "2026-09-01",
	"/vols/paris-dublin": "2026-09-01",
	"/vols/paris-gdansk": "2026-09-01",
	"/vols/paris-hong-kong": "2026-09-01",
	"/vols/paris-istanbul": "2026-09-01",
	"/vols/paris-le-caire": "2026-09-01",
	"/vols/paris-lisbonne": "2026-09-01",
	"/vols/paris-londres": "2026-09-01",
	"/vols/paris-los-angeles": "2026-09-01",
	"/vols/paris-madrid": "2026-09-01",
	"/vols/paris-marrakech": "2026-09-01",
	"/vols/paris-mexico": "2026-09-01",
	"/vols/paris-miami": "2026-09-01",
	"/vols/paris-milan": "2026-09-01",
	"/vols/paris-montreal": "2026-09-01",
	"/vols/paris-munich": "2026-09-01",
	"/vols/paris-new-york": "2026-09-01",
	"/vols/paris-porto": "2026-09-01",
	"/vols/paris-prague": "2026-09-01",
	"/vols/paris-reykjavik": "2026-09-01",
	"/vols/paris-rome": "2026-09-01",
	"/vols/paris-seoul": "2026-09-01",
	"/vols/paris-seville": "2026-09-01",
	"/vols/paris-stockholm": "2026-09-01",
	"/vols/paris-tokyo": "2026-09-01",
	"/vols/paris-trieste": "2026-09-01",
	"/vols/paris-vienne": "2026-09-01"
};
/** Date de dernière modification d'une page, ou undefined si inconnue. */
function pageLastmod(route) {
	return PAGE_LASTMOD[route];
}
function xmlResponse(body) {
	return new Response(body, { headers: {
		"Content-Type": "application/xml; charset=utf-8",
		"Cache-Control": "public, max-age=3600"
	} });
}
/**
* `changefreq` et `priority` ne sont volontairement pas émis : Google les
* ignore totalement depuis des années.
*/
function urlsetXml(origin, entries) {
	return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.map((entry) => [
		"  <url>",
		`    <loc>${origin}${entry.loc}</loc>`,
		entry.lastmod ? `    <lastmod>${entry.lastmod}</lastmod>` : null,
		"  </url>"
	].filter(Boolean).join("\n")).join("\n")}
</urlset>
`;
}
/**
* Sitemap unique.
*
* La découpe en index + segments n'a plus lieu d'être : le site est passé
* d'environ un millier de pages de liaison à la liste blanche, très loin de la
* limite de 50 000 URL par fichier.
*
* Aucune entrée ne porte `changefreq` ni `priority` : Google les ignore.
*
* Chaque entrée porte en revanche un `lastmod` réel. Il vient soit du champ
* `updated` tenu à la main (guides, articles, comparatifs, formalités), soit de
* la date de validation de la liste blanche, soit de l'historique Git via
* `PAGE_LASTMOD` pour les pages qui n'ont pas de date dans leurs données.
* Aucune n'est une date de génération : elles ne bougent que si le contenu bouge.
*/
var Route$10 = createFileRoute("/sitemap.xml")({ server: { handlers: { GET: () => {
	const origin = SITE_URL;
	const staticPages = [
		"/",
		"/mode-budget",
		"/conseils",
		"/conseils/destinations",
		"/comparatifs",
		"/conseils/formalites",
		"/faq",
		"/contact",
		"/indemnisation",
		"/hebergement"
	];
	/** Toute entrée est datée dès que nous connaissons une date réelle. */
	const dated = (loc, lastmod) => {
		const date = lastmod ?? pageLastmod(loc);
		return date ? {
			loc,
			lastmod: date
		} : { loc };
	};
	const entries = [
		...staticPages.map((loc) => dated(loc)),
		...withoutPruned(DESTINATIONS, PRUNED_ROUTE_SLUGS).map((d) => dated(`/vols/${d.slug}`)),
		...ROUTE_WHITELIST.map((r) => dated(`/vols/${r.slug}`, WHITELIST_VALIDATED_AT)),
		...INDEXED_LEGACY_SLUGS.map((slug) => dated(`/vols/${slug}`)),
		...withoutPruned(CITY_GUIDES, PRUNED_GUIDE_SLUGS).map((g) => dated(`/conseils/destinations/${g.slug}`, g.updated)),
		...POSTS.map((p) => dated(`/conseils/${p.slug}`, p.updated)),
		...withoutPruned(COMPARISONS, PRUNED_COMPARISON_SLUGS).map((c) => dated(`/comparatifs/${c.slug}`, c.updated)),
		...TRAVEL_DOCUMENTS.map((d) => dated(`/conseils/formalites/${d.slug}`, d.updated))
	];
	const seen = /* @__PURE__ */ new Set();
	return xmlResponse(urlsetXml(origin, entries.filter((entry) => {
		if (seen.has(entry.loc)) return false;
		seen.add(entry.loc);
		return true;
	})));
} } } });
var $$splitComponentImporter$3 = () => import("./admin.journal-B0BUuiq7.mjs");
var Route$9 = createFileRoute("/admin/journal")({
	head: () => ({ meta: [
		{ title: "Journal technique — TrouveMonVol" },
		{
			name: "description",
			content: "Page interne de diagnostic : appels à l'API de prix et créations d'alertes email sur TrouveMonVol."
		},
		{
			name: "robots",
			content: "noindex, nofollow"
		},
		{
			property: "og:title",
			content: "Journal technique — TrouveMonVol"
		},
		{
			property: "og:description",
			content: "Diagnostic interne des appels de prix et des alertes email."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
var $$splitComponentImporter$2 = () => import("./comparatifs.index-DExRwig1.mjs");
var TITLE$2 = "Comparatifs de destinations : laquelle choisir ? | TrouveMonVol";
var DESCRIPTION$2 = "Vol, budget, climat et ambiance comparés entre deux destinations pour vous aider à trancher avant de réserver.";
var PAGE_URL$1 = `${SITE_URL}/comparatifs`;
var Route$8 = createFileRoute("/comparatifs/")({
	head: () => ({
		meta: [
			{ title: TITLE$2 },
			{
				name: "description",
				content: DESCRIPTION$2
			},
			{
				property: "og:title",
				content: TITLE$2
			},
			{
				property: "og:description",
				content: DESCRIPTION$2
			},
			{
				property: "og:url",
				content: PAGE_URL$1
			},
			{
				property: "og:image",
				content: DEFAULT_OG_IMAGE
			},
			{
				name: "twitter:image",
				content: DEFAULT_OG_IMAGE
			}
		],
		links: [{
			rel: "canonical",
			href: PAGE_URL$1
		}],
		scripts: [{
			type: "application/ld+json",
			children: JSON.stringify({
				"@context": "https://schema.org",
				"@type": "ItemList",
				name: TITLE$2,
				url: PAGE_URL$1,
				itemListElement: withoutPruned(COMPARISONS, PRUNED_COMPARISON_SLUGS).map((c, index) => ({
					"@type": "ListItem",
					position: index + 1,
					name: c.title,
					url: `${PAGE_URL$1}/${c.slug}`
				}))
			})
		}]
	}),
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
var $$splitComponentImporter$1 = () => import("./conseils.index-CfQ4skXe.mjs");
var TITLE$1 = "Conseils pour payer son billet d'avion moins cher | TrouveMonVol";
var DESCRIPTION$1 = "Nos guides concrets pour trouver un vol pas cher : quand réserver, comment fonctionnent les prix des compagnies, comment éviter les frais cachés.";
var listItems = POSTS.map((post) => ({
	name: post.title,
	url: `${SITE_URL}/conseils/${post.slug}`
}));
var Route$7 = createFileRoute("/conseils/")({
	head: () => ({
		meta: [
			{ title: TITLE$1 },
			{
				name: "description",
				content: DESCRIPTION$1
			},
			{
				property: "og:title",
				content: TITLE$1
			},
			{
				property: "og:description",
				content: DESCRIPTION$1
			},
			{
				property: "og:url",
				content: `${SITE_URL}/conseils`
			},
			{
				property: "og:image",
				content: DEFAULT_OG_IMAGE
			},
			{
				name: "twitter:image",
				content: DEFAULT_OG_IMAGE
			}
		],
		links: [{
			rel: "canonical",
			href: `${SITE_URL}/conseils`
		}],
		scripts: [{
			type: "application/ld+json",
			children: JSON.stringify({
				"@context": "https://schema.org",
				"@type": "ItemList",
				name: TITLE$1,
				url: `${SITE_URL}/conseils`,
				itemListElement: listItems.map((item, index) => ({
					"@type": "ListItem",
					position: index + 1,
					name: item.name,
					url: item.url
				}))
			})
		}]
	}),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
/** Ancienne URL conservée : redirection permanente vers /vols/<slug>. */
var Route$6 = createFileRoute("/vols-pas-chers/$slug")({ loader: ({ params }) => {
	throw redirect({
		to: "/vols/$slug",
		params: { slug: params.slug },
		statusCode: 301
	});
} });
/**
* Export des deux seules tables irremplaçables, en JSON.
*
* `price_alerts` et `newsletter_subscribers` ne se reconstruisent pas : tout le
* reste (prix, cache, journal) se régénère depuis la source tarifaire. Ce sont
* donc les seules données dont la perte serait définitive, et rien ne doit
* bouger avant qu'elles soient sorties et vérifiées.
*
* TEMPORAIRE — À SUPPRIMER UNE FOIS L'EXPORT FAIT ET VÉRIFIÉ.
*
* Cet endpoint expose des adresses e-mail. Il n'existe que parce que le projet
* Supabase appartient à la plateforme et que sa clé de service n'est pas
* lisible. Trois précautions :
*
*  - jeton exigé en en-tête `x-admin-token`, comparé à `ADMIN_LOGS_TOKEN`, la
*    variable qui protège déjà la page d'administration. Aucun repli : si elle
*    n'est pas définie, l'endpoint refuse tout ;
*  - jamais de jeton dans l'URL, qui se retrouverait dans les journaux d'accès ;
*  - `Cache-Control: no-store` et `X-Robots-Tag: noindex`.
*
* Le dépôt GitHub étant public, aucune valeur de jeton ne doit apparaître ici
* ni dans un commit.
*/
var TABLES = ["price_alerts", "newsletter_subscribers"];
/** Comparaison à durée constante : une comparaison naïve fuit le préfixe. */
function memeJeton(a, b) {
	if (a.length !== b.length) return false;
	let diff = 0;
	for (let i = 0; i < a.length; i += 1) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
	return diff === 0;
}
var json = (corps, status = 200) => new Response(JSON.stringify(corps, null, 2), {
	status,
	headers: {
		"Content-Type": "application/json; charset=utf-8",
		"Cache-Control": "no-store",
		"X-Robots-Tag": "noindex, nofollow"
	}
});
var Route$5 = createFileRoute("/api/public/exporter-donnees")({ server: { handlers: { GET: async ({ request }) => {
	const attendu = process.env["ADMIN_LOGS_TOKEN"];
	if (!attendu) return json({ error: "ADMIN_LOGS_TOKEN n'est pas définie côté serveur." }, 503);
	if (!memeJeton(request.headers.get("x-admin-token") ?? "", attendu)) return json({ error: "Unauthorized" }, 401);
	try {
		const { supabaseAdmin } = await import("./client.server-KzwUIAkW.mjs");
		const sortie = {};
		for (const table of TABLES) {
			const donnees = [];
			for (let debut = 0;; debut += 1e3) {
				const { data, error } = await supabaseAdmin.from(table).select("*").order("created_at", { ascending: true }).range(debut, debut + 999);
				if (error) throw error;
				donnees.push(...data ?? []);
				if (!data || data.length < 1e3) break;
			}
			sortie[table] = {
				lignes: donnees.length,
				donnees
			};
		}
		return json({
			exporteLe: (/* @__PURE__ */ new Date()).toISOString(),
			source: process.env["SUPABASE_URL"] ?? null,
			tables: sortie
		});
	} catch (error) {
		console.error("Export impossible", error);
		return json({ error: error instanceof Error ? error.message : "échec de l'export" }, 500);
	}
} } } });
/**
* Mise à jour des prix Travelpayouts (appelée par la tâche planifiée).
*
* L'endpoint acceptait, à défaut de secret, la clé publiable du projet — laquelle
* est injectée dans le bundle client sous `VITE_SUPABASE_PUBLISHABLE_KEY`. Elle
* ne protégeait donc rien : n'importe quel visiteur pouvait la lire et déclencher
* la tâche en boucle, aux frais du quota tarifaire. Un vrai secret serveur est
* désormais exigé, et l'endpoint refuse tout s'il n'est pas configuré.
*
* `x-refresh-secret` / `PRICE_REFRESH_SECRET` reste accepté le temps que la tâche
* déjà planifiée bascule sur `x-cron-secret` / `CRON_SECRET` : c'est un secret
* serveur lui aussi, pas un trou.
*/
var Route$4 = createFileRoute("/api/public/rafraichir-prix")({ server: { handlers: { POST: async ({ request }) => {
	const { refuseJobRequest } = await import("./job-auth.server-BcztPFAF.mjs");
	const refus = refuseJobRequest(request, [{
		header: "x-refresh-secret",
		env: "PRICE_REFRESH_SECRET"
	}], true);
	if (refus) return refus;
	const { refreshFlightPrices } = await import("./price-refresh.server-ZHSo4V_j.mjs");
	const state = await refreshFlightPrices("cron");
	return new Response(JSON.stringify(state), { headers: {
		"Content-Type": "application/json",
		"Cache-Control": "no-store"
	} });
} } } });
/**
* Relevé de la saisonnalité, appelé par la tâche planifiée.
*
* Chaque invocation traite les quelques routes les plus anciennement relevées,
* douze mois chacune. Le travail est donc étalé sur plusieurs passages, et
* reprenable : il n'y a aucun curseur à tenir, l'ordre de fraîcheur suffit à
* reprendre là où le passage précédent s'est arrêté — ou interrompu.
*
* `?routes=N` force la taille d'un passage, dans la limite de 24.
*
* Protection : secret serveur `CRON_SECRET` en en-tête `x-cron-secret`, jamais
* la clé publiable — celle-ci est dans le bundle client et ne protège rien.
*/
/**
* Un seul relevé à la fois par isolat.
*
* Sans ce garde, deux appels concurrents traiteraient les mêmes routes (elles
* sont choisies par ancienneté, et rien n'est encore écrit au moment du choix)
* et doubleraient la consommation du quota tarifaire pour rien.
*/
var enCours = false;
var Route$3 = createFileRoute("/api/public/relever-saisonnalite")({ server: { handlers: { POST: async ({ request }) => {
	const { refuseJobRequest } = await import("./job-auth.server-BcztPFAF.mjs");
	const refus = refuseJobRequest(request);
	if (refus) return refus;
	if (enCours) return new Response(JSON.stringify({
		error: "Un relevé est déjà en cours.",
		reprenable: true
	}), {
		status: 409,
		headers: { "Content-Type": "application/json" }
	});
	const demande = Number(new URL(request.url).searchParams.get("routes"));
	const routes = Number.isFinite(demande) && demande > 0 ? Math.min(demande, 24) : void 0;
	enCours = true;
	try {
		const { ingestSeasonality } = await import("./seasonality.server-Ced8rKxp.mjs");
		const rapport = await ingestSeasonality(routes === void 0 ? {} : { routes });
		return new Response(JSON.stringify(rapport), { headers: {
			"Content-Type": "application/json",
			"Cache-Control": "no-store"
		} });
	} catch (error) {
		console.error("Relevé de saisonnalité interrompu", error);
		return new Response(JSON.stringify({
			error: error instanceof Error ? error.message : "échec du relevé",
			reprenable: true
		}), {
			status: 500,
			headers: { "Content-Type": "application/json" }
		});
	} finally {
		enCours = false;
	}
} } } });
/**
* Vérification quotidienne des alertes prix (appelée par la tâche planifiée).
* Protégée par un secret partagé passé dans l'en-tête x-alert-secret.
*/
var Route$2 = createFileRoute("/api/public/verifier-alertes")({ server: { handlers: { POST: async ({ request }) => {
	const secret = process.env["ALERTS_CRON_SECRET"];
	const provided = request.headers.get("x-alert-secret");
	if (!secret || provided !== secret) return new Response(JSON.stringify({ error: "Unauthorized" }), {
		status: 401,
		headers: { "Content-Type": "application/json" }
	});
	const { runAlertCheck } = await import("./alerts.server-CfJLhiSF.mjs");
	const origin = new URL(request.url).origin;
	const result = await runAlertCheck(origin);
	return new Response(JSON.stringify(result), { headers: {
		"Content-Type": "application/json",
		"Cache-Control": "no-store"
	} });
} } } });
var $$splitComponentImporter = () => import("./conseils.formalites.index-oMT3ivYu.mjs");
var TITLE = "Documents et formalités par destination | TrouveMonVol";
var DESCRIPTION = "Visa, validité du passeport, vaccins recommandés : les formalités à connaître avant de partir, pays par pays, pour les voyageurs français.";
var PAGE_URL = `${SITE_URL}/conseils/formalites`;
var Route$1 = createFileRoute("/conseils/formalites/")({
	head: () => ({
		meta: [
			{ title: TITLE },
			{
				name: "description",
				content: DESCRIPTION
			},
			{
				property: "og:title",
				content: TITLE
			},
			{
				property: "og:description",
				content: DESCRIPTION
			},
			{
				property: "og:url",
				content: PAGE_URL
			},
			{
				property: "og:image",
				content: DEFAULT_OG_IMAGE
			},
			{
				name: "twitter:image",
				content: DEFAULT_OG_IMAGE
			}
		],
		links: [{
			rel: "canonical",
			href: PAGE_URL
		}],
		scripts: [{
			type: "application/ld+json",
			children: JSON.stringify({
				"@context": "https://schema.org",
				"@type": "ItemList",
				name: TITLE,
				url: PAGE_URL,
				itemListElement: TRAVEL_DOCUMENTS.map((d, index) => ({
					"@type": "ListItem",
					position: index + 1,
					name: d.country,
					url: `${PAGE_URL}/${d.slug}`
				}))
			})
		}]
	}),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
var Route = createFileRoute("/lovable/email/transactional/preview")({ server: { handlers: { POST: async ({ request }) => {
	const apiKey = process.env["LOVABLE_API_KEY"];
	if (!apiKey) return Response.json({ error: "Server configuration error" }, { status: 500 });
	if (request.headers.get("Authorization")?.replace(/^Bearer\s+/i, "") !== apiKey) return Response.json({ error: "Unauthorized" }, { status: 401 });
	const templateNames = Object.keys(TEMPLATES);
	const results = [];
	for (const name of templateNames) {
		const entry = TEMPLATES[name];
		if (!entry) continue;
		const displayName = entry.displayName || name;
		if (!entry.previewData) {
			results.push({
				templateName: name,
				displayName,
				subject: "",
				html: "",
				status: "preview_data_required"
			});
			continue;
		}
		try {
			const html = await render(import_react.createElement(entry.component, entry.previewData));
			const resolvedSubject = typeof entry.subject === "function" ? entry.subject(entry.previewData) : entry.subject;
			results.push({
				templateName: name,
				displayName,
				subject: resolvedSubject,
				html,
				status: "ready"
			});
		} catch (err) {
			console.error("Failed to render template for preview", {
				template: name,
				error: err
			});
			results.push({
				templateName: name,
				displayName,
				subject: "",
				html: "",
				status: "render_failed",
				errorMessage: err instanceof Error ? err.message : String(err)
			});
		}
	}
	return Response.json({ templates: results });
} } } });
var IndexRoute = Route$29.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$20
});
var CguRoute = Route$19.update({
	id: "/cgu",
	path: "/cgu",
	getParentRoute: () => Route$20
});
var ConfidentialiteRoute = Route$18.update({
	id: "/confidentialite",
	path: "/confidentialite",
	getParentRoute: () => Route$20
});
var ContactRoute = Route$17.update({
	id: "/contact",
	path: "/contact",
	getParentRoute: () => Route$20
});
var CookiesRoute = Route$16.update({
	id: "/cookies",
	path: "/cookies",
	getParentRoute: () => Route$20
});
var DestinationsProposesRoute = Route$15.update({
	id: "/destinations-proposes",
	path: "/destinations-proposes",
	getParentRoute: () => Route$20
});
var FaqRoute = Route$14.update({
	id: "/faq",
	path: "/faq",
	getParentRoute: () => Route$20
});
var HebergementRoute = Route$13.update({
	id: "/hebergement",
	path: "/hebergement",
	getParentRoute: () => Route$20
});
var IndemnisationRoute = Route$12.update({
	id: "/indemnisation",
	path: "/indemnisation",
	getParentRoute: () => Route$20
});
var MentionsLegalesRoute = Route$11.update({
	id: "/mentions-legales",
	path: "/mentions-legales",
	getParentRoute: () => Route$20
});
var ModeBudgetRoute = Route$27.update({
	id: "/mode-budget",
	path: "/mode-budget",
	getParentRoute: () => Route$20
});
var RechercheRoute = Route$28.update({
	id: "/recherche",
	path: "/recherche",
	getParentRoute: () => Route$20
});
var SitemapDotxmlRoute = Route$10.update({
	id: "/sitemap.xml",
	path: "/sitemap.xml",
	getParentRoute: () => Route$20
});
var AdminJournalRoute = Route$9.update({
	id: "/admin/journal",
	path: "/admin/journal",
	getParentRoute: () => Route$20
});
var AlertesDesinscriptionRoute = Route$21.update({
	id: "/alertes/desinscription",
	path: "/alertes/desinscription",
	getParentRoute: () => Route$20
});
var ComparatifsIndexRoute = Route$8.update({
	id: "/comparatifs/",
	path: "/comparatifs/",
	getParentRoute: () => Route$20
});
var ComparatifsSlugRoute = Route$22.update({
	id: "/comparatifs/$slug",
	path: "/comparatifs/$slug",
	getParentRoute: () => Route$20
});
var ConseilsIndexRoute = Route$7.update({
	id: "/conseils/",
	path: "/conseils/",
	getParentRoute: () => Route$20
});
var ConseilsSlugRoute = Route$23.update({
	id: "/conseils/$slug",
	path: "/conseils/$slug",
	getParentRoute: () => Route$20
});
var VolsPasChersSlugRoute = Route$6.update({
	id: "/vols-pas-chers/$slug",
	path: "/vols-pas-chers/$slug",
	getParentRoute: () => Route$20
});
var VolsSlugRoute = Route$30.update({
	id: "/vols/$slug",
	path: "/vols/$slug",
	getParentRoute: () => Route$20
});
var ApiPublicExporterDonneesRoute = Route$5.update({
	id: "/api/public/exporter-donnees",
	path: "/api/public/exporter-donnees",
	getParentRoute: () => Route$20
});
var ApiPublicRafraichirPrixRoute = Route$4.update({
	id: "/api/public/rafraichir-prix",
	path: "/api/public/rafraichir-prix",
	getParentRoute: () => Route$20
});
var ApiPublicReleverSaisonnaliteRoute = Route$3.update({
	id: "/api/public/relever-saisonnalite",
	path: "/api/public/relever-saisonnalite",
	getParentRoute: () => Route$20
});
var ApiPublicVerifierAlertesRoute = Route$2.update({
	id: "/api/public/verifier-alertes",
	path: "/api/public/verifier-alertes",
	getParentRoute: () => Route$20
});
var ConseilsDestinationsIndexRoute = Route$25.update({
	id: "/conseils/destinations/",
	path: "/conseils/destinations/",
	getParentRoute: () => Route$20
});
var ConseilsDestinationsCityRoute = Route$24.update({
	id: "/conseils/destinations/$city",
	path: "/conseils/destinations/$city",
	getParentRoute: () => Route$20
});
var ConseilsFormalitesIndexRoute = Route$1.update({
	id: "/conseils/formalites/",
	path: "/conseils/formalites/",
	getParentRoute: () => Route$20
});
var rootRouteChildren = {
	IndexRoute,
	CguRoute,
	ConfidentialiteRoute,
	ContactRoute,
	CookiesRoute,
	DestinationsProposesRoute,
	FaqRoute,
	HebergementRoute,
	IndemnisationRoute,
	MentionsLegalesRoute,
	ModeBudgetRoute,
	RechercheRoute,
	SitemapDotxmlRoute,
	AdminJournalRoute,
	AlertesDesinscriptionRoute,
	ComparatifsSlugRoute,
	ConseilsSlugRoute,
	VolsPasChersSlugRoute,
	VolsSlugRoute,
	ComparatifsIndexRoute,
	ConseilsIndexRoute,
	ApiPublicExporterDonneesRoute,
	ApiPublicRafraichirPrixRoute,
	ApiPublicReleverSaisonnaliteRoute,
	ApiPublicVerifierAlertesRoute,
	ConseilsDestinationsCityRoute,
	ConseilsFormalitesPaysRoute: Route$26.update({
		id: "/conseils/formalites/$pays",
		path: "/conseils/formalites/$pays",
		getParentRoute: () => Route$20
	}),
	ConseilsDestinationsIndexRoute,
	ConseilsFormalitesIndexRoute,
	LovableEmailTransactionalPreviewRoute: Route.update({
		id: "/lovable/email/transactional/preview",
		path: "/lovable/email/transactional/preview",
		getParentRoute: () => Route$20
	})
};
var routeTree = Route$20._addFileChildren(rootRouteChildren)._addFileTypes();
var getRouter = () => {
	const queryClient = new QueryClient();
	return createRouter({
		routeTree,
		context: { queryClient },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { getRouter };
