/**
 * Marketing Layout — wraps all public marketing pages
 * Provides Header + Footer automatically so child routes don't need to.
 *
 * Routes:  /  /about  /pricing  /templates
 */
import type { RouteSectionProps } from "@solidjs/router";
import { Header } from "@formanywhere/shared/header";
import { Footer } from "@formanywhere/shared/footer";

export default function MarketingLayout(props: RouteSectionProps) {
    return (
        <>
            <Header />
            <main id="main-content">{props.children}</main>
            <Footer />
        </>
    );
}
