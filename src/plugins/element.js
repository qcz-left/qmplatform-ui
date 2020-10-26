import Vue from 'vue'
import 'element-ui/lib/theme-chalk/index.css'
import {
  Button,
  Form,
  FormItem,
  Input,
  Message,
  Container,
  Header,
  Aside,
  Main,
  Footer,
  Menu,
  Submenu,
  MenuItem,
  Breadcrumb,
  BreadcrumbItem,
  Card,
  Row,
  Col,
  Table,
  TableColumn,
  Switch,
  Tooltip,
  Pagination,
  Dialog,
  ColorPicker,
  MenuItemGroup,
  Select,
  Option,
  DropdownItem,
  DropdownMenu,
  Dropdown,
  Tag,
  MessageBox,
  Loading,
  Cascader,
  Popover,
  Tree
} from 'element-ui'

MessageBox.setDefaults({
  dangerouslyUseHTMLString: true,
  showCancelButton: true,
  closeOnClickModal: false,
  closeOnPressEscape: false,
  center: true
})
Dialog.props.closeOnClickModal.default = false;
Dialog.props.closeOnPressEscape.default = false;
Dialog.props.center.default = true;
Input.props.clearable.default = true;

Vue.use(Tree);
Vue.use(Popover);
Vue.use(Cascader);
Vue.use(Loading);
Vue.use(Tag);
Vue.use(Dropdown);
Vue.use(DropdownMenu);
Vue.use(DropdownItem);
Vue.use(ColorPicker);
Vue.use(MenuItemGroup);
Vue.use(Select);
Vue.use(Option);
Vue.use(Button);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Input);
Vue.use(Container);
Vue.use(Header);
Vue.use(Aside);
Vue.use(Main);
Vue.use(Footer);
Vue.use(Menu);
Vue.use(Submenu);
Vue.use(MenuItem);
Vue.use(Breadcrumb);
Vue.use(BreadcrumbItem);
Vue.use(Card);
Vue.use(Row);
Vue.use(Col);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Switch);
Vue.use(Tooltip);
Vue.use(Pagination);
Vue.use(Dialog);
Vue.prototype.$message = Message;
Vue.prototype.$msgbox = MessageBox;
Vue.prototype.$alert = MessageBox.alert;
Vue.prototype.$confirm = MessageBox.confirm;
Vue.prototype.$prompt = MessageBox.prompt;
