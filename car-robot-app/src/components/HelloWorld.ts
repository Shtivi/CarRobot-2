import { Component, Vue, Prop } from 'vue-property-decorator'
import WithRender from './HelloWorld.template.html';

@Component
@WithRender
export default class HelloWorld extends Vue {
    @Prop() msg!: string;
}