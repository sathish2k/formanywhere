/**
 * Marketing Layout — wraps all public marketing pages
 * Provides Header + Footer automatically so child routes don't need to.
 *
 * Routes:  /  /about  /pricing  /templates
 *
 * Footer is clientOnly — never SSR'd (always below fold).
 */
import type { RouteSectionProps, RouteDefinition } from "@solidjs/router";
import { createAsync } from "@solidjs/router";
import { clientOnly } from "@solidjs/start";
import { Header } from "@formanywhere/shared/header";
import { getSession } from "~/server/session";

const Footer = clientOnly(() => import("@formanywhere/shared/footer"));

export const route = {
    preload: () => getSession(),
} satisfies RouteDefinition;

export default function MarketingLayout(props: RouteSectionProps) {
    const session = createAsync(() => getSession());

    return (
        <>
            <Header isAuthenticated={!!session()} />
            <main id="main-content">{props.children}</main>
            <Footer />
        </>
    );
}
