import { createViewComponent, registerView } from "@frui.ts/views";
import React from "react";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { List } from "./List";
import TodoListViewModel from "./viewModel";

export const todoListView = createViewComponent<TodoListViewModel>(vm => (
  <>
    <section className="todoapp">
      <Header vm={vm} />
      {!!vm.list.length && <List vm={vm} />}
      {!!vm.list.length && <Footer vm={vm} />}
    </section>
    <footer className="info">
      <p>Double-click to edit a todo</p>
      <p>
        Template by <a href="http://sindresorhus.com">Sindre Sorhus</a>
      </p>
    </footer>
  </>
));

registerView(todoListView, TodoListViewModel);
