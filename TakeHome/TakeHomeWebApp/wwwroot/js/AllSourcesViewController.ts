
//
// The view subcontroller of All Sources
// 
class AllSourcesViewController {
    private sources: Source[];
    private state: ControllerState;
    private $root: JQuery<HTMLElement>;
    private sourceSelectCallbacks: ((selectedSource: Source) => void)[]

    /**
     * Instantiates the All Sources view subcontroller.
     * */
    public constructor() {
        this.$root = $("#all-sources-view");
        this.sourceSelectCallbacks = [];
    }

    // ==============================
    // Public Functions
    // ==============================

    /**
     * Registers an event handler for the source-selected event. The source which
     * is selected will be passed to the callback.
     * @param callback Event handler for the selected source.
     */
    public sourceSelected(callback: (selectedSource: Source) => void) {
        this.sourceSelectCallbacks.push(callback);
    }

    /**
     * Shows the component, retrieving and displaying sources to the user.
     * */
    public show() {
        this.state = ControllerState.Loading;

        this.sources = null;

        this.refreshView();

        this.$root.fadeIn();

        this.getSources();
    }

    /**
     * Hides the component.
     * */
    public hide() {
        this.$root.hide();
    }

    // ==============================
    // Server functions
    // ==============================

    /**
     * Retrieves all sources fro the server. Called when the component is
     * enabled with show().
     * */
    private getSources() {
        $.ajax({
            url: "/source",
            type: "GET",
            success: this.getSourcesCallback
        });
    }

    /**
     * Callback for the all-sources retrieval.
     */
    private getSourcesCallback = (data: any) => {
        this.sources = data;

        this.state = ControllerState.Ready;

        this.refreshView();
    }

    // ==============================
    // DIsplay functions
    // ==============================

    /**
     * Refreshes UI elements based on the model and model-retrieval state.
     * */
    private refreshView() {
        this.$root.find('.loading-message').toggle(this.state === ControllerState.Loading);
        this.$root.find('.table').toggle(this.state === ControllerState.Ready);

        if (this.sources === null) {
            return;
        }

        const $tableBody = this.$root.find('.table tbody');

        $tableBody.empty();

        for (let source of this.sources) {
            const $tr = $('<tr></tr>').data('source', source);
            $('<td></td>').text(source.id).appendTo($tr);
            $('<td></td>').text(source.name).appendTo($tr);
            $('<td></td>').text(source.environment).appendTo($tr);
            $('<td></td>').text(source.encoding).appendTo($tr);
            $('<td></td>').text(source.created).appendTo($tr);
            $('<td></td>').text(source.updated).appendTo($tr);
            $tableBody.append($tr);
        }

        $tableBody.find('tr').click(this.sourceRow_click);
    }

    // ==============================
    // UI Events
    // ==============================

    private sourceRow_click = (e: any) => {
        const selectedSource = $(e.currentTarget).data('source') as Source;

        for (let callback of this.sourceSelectCallbacks) {
            callback(selectedSource);
        }
    }
}
