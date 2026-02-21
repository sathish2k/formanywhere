/**
 * Marketing Layout — wraps all public marketing pages
 * Provides Header + Footer automatically so child routes don't need to.
 *
 * Routes:  /  /about  /pricing  /templates
 *
 * Footer is clientOnly — never SSR'd (always below fold).
 */
import type { RouteSectionProps } from "@solidjs/router";
import { clientOnly } from "@solidjs/start";
import { Header } from "@formanywhere/shared/header";

const Footer = clientOnly(() => import("@formanywhere/shared/footer"));

export default function MarketingLayout(props: RouteSectionProps) {
    return (
        <>
            <Header />
            <main id="main-content">{props.children}</main>
            <Footer />
        </>
    );
}
