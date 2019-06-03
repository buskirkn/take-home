//
// ViewController is the root controller for the SPA.
// It must be initialized when the document finishes loading.
//
class ViewController {
    private allSourcesViewController: AllSourcesViewController;
    private sourceViewController: SourceViewController;

    /**
     * Initializes the ViewController. Must be called when the document is
     * ready to begin the application.
     * */
    public initialize() {
        // Intantiate and configure the view subcontrollers.
        this.allSourcesViewController = new AllSourcesViewController();

        this.allSourcesViewController.sourceSelected(this.onSourceSelected);

        this.sourceViewController = new SourceViewController();

        this.sourceViewController.backButtonClicked(this.onSourceBacked);

        // Show the "All Sources" view
        this.allSourcesViewController.show();
    }

    /**
     * Event for a source-selected. Switches the view to the specific
     * Source.
     */
    private onSourceSelected = (source: Source) => {
        this.allSourcesViewController.hide();
        this.sourceViewController.show(source);
    }

    /**
     * Even for the source "back" button clicked. Switches the view back
     * to the all-sources view.
     */
    private onSourceBacked = () => {
        this.sourceViewController.hide();
        this.allSourcesViewController.show();
    }
}