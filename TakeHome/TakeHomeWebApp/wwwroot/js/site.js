var Message = /** @class */ (function () {
    function Message() {
    }
    return Message;
}());
var Source = /** @class */ (function () {
    function Source() {
    }
    return Source;
}());
//
// ViewController is the root controller for the SPA.
// It must be initialized when the document finishes loading.
//
var ViewController = /** @class */ (function () {
    function ViewController() {
        var _this = this;
        /**
         * Event for a source-selected. Switches the view to the specific
         * Source.
         */
        this.onSourceSelected = function (source) {
            _this.allSourcesViewController.hide();
            _this.sourceViewController.show(source);
        };
        /**
         * Even for the source "back" button clicked. Switches the view back
         * to the all-sources view.
         */
        this.onSourceBacked = function () {
            _this.sourceViewController.hide();
            _this.allSourcesViewController.show();
        };
    }
    /**
     * Initializes the ViewController. Must be called when the document is
     * ready to begin the application.
     * */
    ViewController.prototype.initialize = function () {
        // Intantiate and configure the view subcontrollers.
        this.allSourcesViewController = new AllSourcesViewController();
        this.allSourcesViewController.sourceSelected(this.onSourceSelected);
        this.sourceViewController = new SourceViewController();
        this.sourceViewController.backButtonClicked(this.onSourceBacked);
        // Show the "All Sources" view
        this.allSourcesViewController.show();
    };
    return ViewController;
}());
//
// The view subcontroller of All Sources
// 
var AllSourcesViewController = /** @class */ (function () {
    /**
     * Instantiates the All Sources view subcontroller.
     * */
    function AllSourcesViewController() {
        var _this = this;
        /**
         * Callback for the all-sources retrieval.
         */
        this.getSourcesCallback = function (data) {
            _this.sources = data;
            _this.state = ControllerState.Ready;
            _this.refreshView();
        };
        // ==============================
        // UI Events
        // ==============================
        this.sourceRow_click = function (e) {
            var selectedSource = $(e.currentTarget).data('source');
            for (var _i = 0, _a = _this.sourceSelectCallbacks; _i < _a.length; _i++) {
                var callback = _a[_i];
                callback(selectedSource);
            }
        };
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
    AllSourcesViewController.prototype.sourceSelected = function (callback) {
        this.sourceSelectCallbacks.push(callback);
    };
    /**
     * Shows the component, retrieving and displaying sources to the user.
     * */
    AllSourcesViewController.prototype.show = function () {
        this.state = ControllerState.Loading;
        this.sources = null;
        this.refreshView();
        this.$root.fadeIn();
        this.getSources();
    };
    /**
     * Hides the component.
     * */
    AllSourcesViewController.prototype.hide = function () {
        this.$root.hide();
    };
    // ==============================
    // Server functions
    // ==============================
    /**
     * Retrieves all sources fro the server. Called when the component is
     * enabled with show().
     * */
    AllSourcesViewController.prototype.getSources = function () {
        $.ajax({
            url: "/source",
            type: "GET",
            success: this.getSourcesCallback
        });
    };
    // ==============================
    // DIsplay functions
    // ==============================
    /**
     * Refreshes UI elements based on the model and model-retrieval state.
     * */
    AllSourcesViewController.prototype.refreshView = function () {
        this.$root.find('.loading-message').toggle(this.state === ControllerState.Loading);
        this.$root.find('.table').toggle(this.state === ControllerState.Ready);
        if (this.sources === null) {
            return;
        }
        var $tableBody = this.$root.find('.table tbody');
        $tableBody.empty();
        for (var _i = 0, _a = this.sources; _i < _a.length; _i++) {
            var source = _a[_i];
            var $tr = $('<tr></tr>').data('source', source);
            $('<td></td>').text(source.id).appendTo($tr);
            $('<td></td>').text(source.name).appendTo($tr);
            $('<td></td>').text(source.environment).appendTo($tr);
            $('<td></td>').text(source.encoding).appendTo($tr);
            $('<td></td>').text(source.created).appendTo($tr);
            $('<td></td>').text(source.updated).appendTo($tr);
            $tableBody.append($tr);
        }
        $tableBody.find('tr').click(this.sourceRow_click);
    };
    return AllSourcesViewController;
}());
//
// The Source View Controller displays a Source and its Messages
//
var SourceViewController = /** @class */ (function () {
    // ==============================
    // Public functions
    // ==============================
    /**
     * Instantiates a source view sub-controller.
     * */
    function SourceViewController() {
        var _this = this;
        this.loadMessageIncrement = 20;
        /**
         * Callback for when messages have been retrieved,
         * which sets the model data and refreshes the view.
         */
        this.getMessagesCallback = function (data) {
            _this.openRequest = null;
            _this.messages = data;
            _this.state = ControllerState.Ready;
            _this.refreshView();
        };
        // ==============================
        // UI Events
        // ==============================
        this.loadMoreMessages_click = function (e) {
            _this.messagesToLoadCount += _this.loadMessageIncrement;
            _this.refreshView();
        };
        this.backButton_click = function (e) {
            for (var _i = 0, _a = _this.backButtonCallbacks; _i < _a.length; _i++) {
                var callback = _a[_i];
                callback();
            }
        };
        this.$root = $("#source-view");
        this.$root.find('.back-button').click(this.backButton_click);
        this.$root.find('.load-more-messages-button').click(this.loadMoreMessages_click);
        this.backButtonCallbacks = [];
    }
    /**
     * Registers an event handler for the back-button click event.
     * @param callback The callback for the back-button click event.
     */
    SourceViewController.prototype.backButtonClicked = function (callback) {
        this.backButtonCallbacks.push(callback);
    };
    /**
     * Shows the component using the given source, and retrieves the source's messages
     * to show.
     * @param source The source to display.
     */
    SourceViewController.prototype.show = function (source) {
        this.state = ControllerState.Loading;
        this.source = source;
        this.messages = null;
        this.messagesToLoadCount = this.loadMessageIncrement;
        this.refreshView();
        this.$root.fadeIn();
        this.getMessages();
    };
    /**
     * Hides the component.
     * */
    SourceViewController.prototype.hide = function () {
        this.$root.hide();
        if (this.openRequest !== null) {
            this.openRequest.abort();
            this.openRequest = null;
        }
    };
    // ==============================
    // Server functions
    // ==============================
    /**
     * Retrieves the messages for the displayed source.
     * */
    SourceViewController.prototype.getMessages = function () {
        this.openRequest =
            $.ajax({
                url: "/source/" + this.source.id + "/message",
                type: "GET",
                success: this.getMessagesCallback
            });
    };
    // ==============================
    // Display functions
    // ==============================
    /**
     * Refreshes UI elements based on the model and model-retrieval state.
     * */
    SourceViewController.prototype.refreshView = function () {
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
        var $tableBody = this.$root.find('.table tbody');
        var aggregateMessageCountTable = {
            "processing": 0,
            "enqueued": 0,
            "error": 0,
            "finished": 0
        };
        var renderedCount = 0;
        $tableBody.empty();
        for (var _i = 0, _a = this.messages; _i < _a.length; _i++) {
            var message = _a[_i];
            if (renderedCount < this.messagesToLoadCount) {
                var $tr = $('<tr></tr>');
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
    };
    /**
     * Helper function to return the text for a message-status counter.
     * The status count is displayed as "<count> (<percentoftotalcount>%)"
     * @param statusCount The count of messages with the same status
     * @param totalCount The total number of messages for this source
     */
    SourceViewController.prototype.getMessageStatusCountText = function (statusCount, totalCount) {
        if (totalCount === 0) {
            return "0";
        }
        var percentage = ((statusCount / totalCount) * 100).toFixed(1);
        return statusCount.toString() + " (" + percentage.toString() + "%)";
    };
    return SourceViewController;
}());
//
// Controller State
// Simple states for a view controller which is used to
// determine what view to display. E.g., a loading message
// may be shown when the controller is still retrieving a model.
//
var ControllerState;
(function (ControllerState) {
    ControllerState[ControllerState["Loading"] = 0] = "Loading";
    ControllerState[ControllerState["Ready"] = 1] = "Ready";
})(ControllerState || (ControllerState = {}));
//# sourceMappingURL=site.js.map