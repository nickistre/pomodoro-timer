var Todo = Todo || {};

Todo.Item = function(text) {
    this.text = text;
    this.complete = false;
};

Todo.WrappedItem = function(index, item) {
    this.index = index;
    this.item = item;
};

Todo.List = function(updateCallback) {
    this.list = [];
    this.updateCallback = updateCallback;
};

// Internal methods

Todo.List.prototype.runUpdateCallback = function() {
    var currentLists = {
        todo: this.getList(false),
        completed: this.getList(true)
    }

    this.updateCallback(currentLists);
}

// Public methods

Todo.List.prototype.add = function(text) {
    var item = new Todo.Item(text);
    this.list.push(item);
    this.runUpdateCallback();
};

/**
 * Used to mark as either complete or not.  Defaults to marking as complete.
 * @param index
 * @param complete
 */
Todo.List.prototype.markComplete = function(index, complete) {
    complete = typeof complete === "undefined" ? true : complete;

    // TODO: Check bounds?
    this.list[index].complete = complete;

    this.runUpdateCallback();
};

/**
 * Returns the current list in an object containing the index.
 * @param onlyComplete
 * @returns {Array}
 */
Todo.List.prototype.getList = function(onlyComplete) {
    var returnList = [];

    for (var listIndex in this.list) {
        var item = this.list[listIndex];

        // Check whether to add the list based on onlyComplete param
        if (typeof onlyComplete === "undefined") {
            // If left undefined, we return the entire list using the wrapping.
            returnList.push(new Todo.WrappedItem(listIndex, item));
        }
        else if (item.complete === onlyComplete) {
            // Only return items that match the onlyComplete parameter
            returnList.push(new Todo.WrappedItem(listIndex, item));
        }

    }

    return returnList;
};
