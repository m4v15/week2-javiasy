var todo = (function() {
    // Part 1. Fill in any missing parts of the todoFunction object!
    // you can access these on todo.todoFunctions
    // For part one we expect you to use tdd

    // each of these functions takes an array of todos
    // [todo]
    // where a todo has the form
    // {
    //   id: /*the id of the todo*/,
    //   description: /*the description of the todo item*/,
    //   done: /*true or false, indicates whether the todo is done*/
    // }

    var todoFunctions = {
        generateId: (function() {
            var idCounter = 0;
            return function () {
                return idCounter++;
            }
        })(),
        addTodo: function (todos, newTodo) {
            // should leave the input argument todos unchanged
            // return a new array, it should contain todos with the newTodo added to the end.
            // add an id to the newTodo. You can use the generateId function to create an id.
            // hint: array.concat
            newTodo.id = this.generateId();
            return todos.concat(newTodo);
        },
        deleteTodo: function (todos, idToDelete) {
            // should leave the input argument todos unchanged
            // return a new array, this should not contain any todo with an id of idToDelete
            // hint: array.filter
            return todos.filter(function(todo) {
                return (todo.id === idToDelete) ? false : true;
            });
        },
        markTodo: function (todos, idToMark) {


            // should leave the input argument todos unchanged
            // in the new todo list, all elements will remain unchanged except the on with id: idToMark
            // this element will have its id toggled
            // hint: array.map

            return todos.map(function(todo){
                var todoCopy = {};  // Create new object

                Object.keys(todo).forEach(function(k) {
                    todoCopy[k] = todo[k]
                }); // Loop through keys of todo object, and assign k/v pairs to todoCopy

                if (todoCopy.id === idToMark) {
                    todoCopy.done = (todoCopy.done) ? false : true;
                    // if todoCopy is true, change to false (toggle)
                }
                return todoCopy;
            });
        },

        alphabetSort: function(a,b){

            //access the description value and make all upper case to ignore differences
            var descriptionA = a.description.toUpperCase();
            var descriptionB = b.description.toUpperCase();

            //compare the descriptions to arrange alphabetically
            if ( descriptionA>descriptionB){
                return 1;
            }
            if (descriptionA<descriptionB){
                return -1;
            }
            return 0;
        },

        sortTodos: function(todos, func=todo.todoFunctions.alphabetSort){
            //use slice to create copy of array
            var newtodos=todos.slice();
            //use sort with alphabetSort as default
            return newtodos.sort(func);


        }

      }

    // part 2. The DOM
    var state = [
        { id: -3, description: 'first todo'},
        { id: -2, description: 'second todo'},
        { id: -1, description: 'third todo'}
    ]; // this is our todoList

    var controller = {
        createTodoNode: function(todoData) {
            // create new li element for this todo item
            var todoNode = document.createElement('li');

            // add span holding description
            var spanNode = document.createElement('span');
            spanNode.innerHTML = '<p>' + todoData.description + '</p>';
            todoNode.appendChild(spanNode);

            // add delete button
            var deleteButtonNode = document.createElement('button');
            deleteButtonNode.className = 'material-icons';
            deleteButtonNode.innerHTML = 'delete';

            deleteButtonNode.addEventListener('click', function(event) {
                state = todoFunctions.deleteTodo(state, todoData.id);
                controller.render(state);
            });
            todoNode.appendChild(deleteButtonNode);

            // change li style if todo item is complete
            if (todoData.done) {
                spanNode.style.textDecoration = 'line-through';
                todoNode.style.color = 'gray';
                todoNode.style.backgroundColor = '#ecfff0';
            }

            // add event listener to li element to mark completion of todo item
            todoNode.addEventListener('click', function(event) {
                state = todoFunctions.markTodo(state,todoData.id);
                controller.render(state);


            });

            return todoNode;
        },
        render: function(state) {
            var todoListWrapper = document.getElementById('todo-container');
            var todoListNode = document.createElement('ul');
            state.forEach(function(todoData) {
                todoListNode.appendChild(controller.createTodoNode(todoData));
            });

            todoListWrapper.replaceChild(todoListNode, todoListWrapper.firstChild);
        }
    }

    // bind create todo form
    var addTodoForm = document.getElementById('add-todo');
    addTodoForm.addEventListener('submit', function(event) {
        console.log('click');   // Debug to verify that the click event has registered
        event.preventDefault(); // addEventListener callback arg + preventDefault() cancels the default submit action (reloads the page)

        var description = event.target.description.value; // The .description is set with the name="description" input attribute
        var newTodo = { // Create a new todo item object
            description: description
        };
        event.target.description.value = '';

        state = todoFunctions.addTodo(state, newTodo);  // addTodo pure function doesn't mutate the state array, but this does change it.



        controller.render(state);
    });

    var sortButtonNode = document.createElement('button'); //create <button></button>
    sortButtonNode.innerHTML = 'Sort Alphabetically'; //add innerHTML <button>Sort Alphabetically</button>

    //add event listener to sortButtonNode to call the sortfunction when clicked
    sortButtonNode.addEventListener('click',function(event) {
        state=todoFunctions.sortTodos(state);
        controller.render(state);
    });

    sortButtonNode.className = "sort-button"; //<button class="sort-button">Sort Alphabetically</button>

    //insert button before the to-do list container in the body
    document.body.insertBefore(sortButtonNode,document.getElementById("todo-container"))



    controller.render(state);

    return { todoFunctions: todoFunctions, state: state };
})();
