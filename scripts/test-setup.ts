// bun:test runs the components in happy-dom so shadow roots, custom elements and events exist.
import { GlobalRegistrator } from "@happy-dom/global-registrator";

GlobalRegistrator.register();
