
//
// The Source View Controller displays a Source and its Messages
//
class SourceViewController {
    private source: Source;
    private messages: Message[];
    private state: ControllerState;
    private $root: JQuery<HTMLElement>;
    private backButtonCallbacks: (() => void)[];
    private openRequest: XMLHttpRequest;
    private messagesToLoadCount: number;
    private readonly loadMessageIncrement: number = 20;

    // ==============================
    // Public functions
    // ==============================

    /**
     * Instantiates a source view sub-controller.
     * */
    public constructor() {
        this.$root = $("#source-view");
        this.$root.find('.back-button').click(this.backButton_click);
        this.$root.find('.load-more-messages-button').click(this.loadMoreMessages_click);
        this.backButtonCallbacks = [];
    }

    /**
     * Registers an event handler for the back-button click event.
     * @param callback The callback for the back-button click event.
     */
    public backButtonClicked(callback: () => void) {
        this.backButtonCallbacks.push(callback);
    }

    /**
     * Shows the component using the given source, and retrieves the source's messages
     * to show.
     * @param source The source to display.
     */
    public show(source: Source) {
        this.state = ControllerState.Loading;

        this.source = source;
        this.messages = null;
        this.messagesToLoadCount = this.loadMessageIncrement;

        this.refreshView();

        this.$root.fadeIn();

        this.getMessages();
    }

    /**
     * Hides the component.
     * */
    public hide() {
        this.$root.hide();

        if (this.openRequest !== null) {
            this.openRequest.abort()
            this.openRequest = null;
        }
    }

    // ==============================
    // Server functions
    // ==============================

    /**
     * Retrieves the messages for the displayed source.
     * */
    private getMessages() {
        this.openRequest =
            $.ajax({
                url: "/source/" + this.source.id + "/message",
                type: "GET",
                success: this.getMessagesCallback
            }) as any;
    }

    /**
     * Callback for when messages have been retrieved,
     * which sets the model data and refreshes the view.
     */
    private getMessagesCallback = (data: any) => {
        this.openRequest = null;

        this.messages = data;

        this.state = ControllerState.Ready;

        this.refreshView();
    }

    // ==============================
    // Display functions
    // ==============================

    /**
     * Refreshes UI elements based on the model and model-retrieval state.
     * */
    private refreshView() {
        this.$root.find('.loading-message').toggle(this.state === ControllerState.Loading);

        this.$root.find('.source-id').text(this.source.id);
        this.$root.find('.source-name').text(this.source.name);
        this.$root.find('.source-environment').text(this.source.environment);
        this.$root.find('.source-encoding').text(this.source.encoding);

        if (this.messages === null) {
            this.$root.find('.no-results-message').hide();
            this.$root.find('.messages-aggregation').hide();
            this.$root.find('.table').hide();
            this.$root.find('.load-more-messages-button').hide();
            return;
        }
        else if (this.messages.length === 0) {
            this.$root.find('.no-results-message').show();
            this.$root.find('.messages-aggregation').hide();
            this.$root.find('.table').hide();
            this.$root.find('.load-more-messages-button').hide();
            return;
        }
        else {
            this.$root.find('.no-results-message').hide();
            this.$root.find('.messages-aggregation').show();
            this.$root.find('.table').show();
            this.$root.find('.load-more-messages-button').show();
        }

        const $tableBody = this.$root.find('.table tbody');

        const aggregateMessageCountTable = {
            "processing": 0,
            "enqueued": 0,
            "error": 0,
            "finished": 0
        };

        let renderedCount = 0;

        $tableBody.empty();

        for (let message of this.messages) {
            if (renderedCount < this.messagesToLoadCount) {
                const $tr = $('<tr></tr>');
                $('<td></td>').text(message.id).appendTo($tr);
                $('<td></td>').text(message.content).appendTo($tr);
                $('<td></td>').text(message.status).appendTo($tr);
                $('<td></td>').text(message.created).appendTo($tr);
                $('<td></td>').text(message.updated).appendTo($tr);
                $tableBody.append($tr);

                renderedCount++;
            }

            aggregateMessageCountTable[message.status]++;
        }

        this.$root.find('.messages-processing-count').text(this.getMessageStatusCountText(aggregateMessageCountTable.processing, this.messages.length));
        this.$root.find('.messages-enqueued-count').text(this.getMessageStatusCountText(aggregateMessageCountTable.enqueued, this.messages.length));
        this.$root.find('.messages-error-count').text(this.getMessageStatusCountText(aggregateMessageCountTable.error, this.messages.length));
        this.$root.find('.messages-finished-count').text(this.getMessageStatusCountText(aggregateMessageCountTable.finished, this.messages.length));

        if (renderedCount === this.messages.length) {
            this.$root.find('.load-more-messages-button').hide();
        }
    }

    /**
     * Helper function to return the text for a message-status counter.
     * The status count is displayed as "<count> (<percentoftotalcount>%)"
     * @param statusCount The count of messages with the same status
     * @param totalCount The total number of messages for this source
     */
    private getMessageStatusCountText(statusCount: number, totalCount: number): string {
        if (totalCount === 0) {
            return "0";
        }

        const percentage = ((statusCount / totalCount) * 100).toFixed(1);

        return statusCount.toString() + " (" + percentage.toString() + "%)";
    }

    // ==============================
    // UI Events
    // ==============================

    private loadMoreMessages_click = (e: any) => {
        this.messagesToLoadCount += this.loadMessageIncrement;
        this.refreshView();
    }

    private backButton_click = (e: any) => {
        for (let callback of this.backButtonCallbacks) {
            callback();
        }
    }
}
