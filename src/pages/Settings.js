import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import requestCategoriesObj from '../services/requestCategories';
import { changeSettingsAction } from '../redux/actions';
import GoBackBtn from '../components/GoBackBtn';

class Settings extends Component {
  constructor() {
    super();

    this.state = {
      categories: [],
      selectedCategory: '',
      selectedDifficulty: '',
      selectedQuestionType: '',
    };
  }

  async componentDidMount() {
    const categoriesArray = await requestCategoriesObj.requestCategories();
    this.setState({
      categories: categoriesArray,
    });
  }

  componentWillUnmount() {
    const { saveSettings } = this.props;
    const { selectedCategory, selectedDifficulty, selectedQuestionType } = this.state;
    saveSettings(selectedCategory, selectedDifficulty, selectedQuestionType);
  }

  handleSelectChange = ({ target }) => {
    this.setState({
      [target.name]: target.value,
    });
  }

  render() {
    const {
      categories, selectedCategory, selectedDifficulty, selectedQuestionType,
    } = this.state;
    const { history } = this.props;
    const difficultyArray = ['easy', 'medium', 'hard'];
    const questionTypeArray = ['multiple', 'boolean'];
    return (
      <main>
        <h1 data-testid="settings-title">Settings</h1>
        {
          categories.length === 0 ? <p>Loading...</p> : (
            <div>
              <label htmlFor="category">
                Category:
                <select
                  name="selectedCategory"
                  value={ selectedCategory }
                  id="category"
                  onChange={ this.handleSelectChange }
                >
                  <option value="">Any</option>
                  {
                    categories
                      .map((category) => (
                        <option
                          key={ category.id }
                          value={ category.id }
                        >
                          {category.name}
                        </option>))
                  }
                </select>
              </label>

              <label htmlFor="difficulty">
                Difficulty:
                <select
                  name="selectedDifficulty"
                  value={ selectedDifficulty }
                  onChange={ this.handleSelectChange }
                  id="difficulty"
                >
                  <option value="">Any</option>
                  {
                    difficultyArray
                      .map((difficulty) => (
                        <option key={ difficulty }>{difficulty}</option>))
                  }
                </select>
              </label>

              <label htmlFor="questionType">
                Type:
                <select
                  name="selectedQuestionType"
                  value={ selectedQuestionType }
                  onChange={ this.handleSelectChange }
                  id="questionType"
                >
                  <option value="">Any</option>
                  {
                    questionTypeArray
                      .map((question) => (
                        <option key={ question }>{question}</option>))
                  }
                </select>
              </label>
            </div>
          )
        }
        <GoBackBtn history={ history } />
      </main>
    );
  }
}

Settings.propTypes = {
  saveSettings: PropTypes.func.isRequired,
  history: PropTypes.objectOf(PropTypes.any).isRequired,
};

const mapDispatchToProps = (dispatch) => ({
  saveSettings:
  (category, difficulty, questionType) => dispatch(
    changeSettingsAction(category, difficulty, questionType),
  ),
});

export default connect(null, mapDispatchToProps)(Settings);
