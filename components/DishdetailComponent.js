import React, { Component } from 'react';
import { Text, View, ScrollView, FlatList, Modal, Button, StyleSheet } from 'react-native';
import { Card, Icon, Rating, Input } from 'react-native-elements';
import { connect } from 'react-redux';
import { baseUrl } from '../shared/baseUrl';
import { postFavorite, postComment } from '../redux/actionCreators';


const mapStateToProps = state => {
    return {
        dishes: state.dishes,
        comments: state.comments,
        favorites: state.favorites
    }
}

const mapDispatchToProps = dispatch => ({
    postFavorite: (dishId) => dispatch(postFavorite(dishId)),
    postComment: (dishId, rating, author, comment) => dispatch(postComment(dishId, rating, author, comment))
})


function RenderDish(props) {

    const dish = props.dish;

    if (dish != null) {
        return (
            <Card
                featuredTitle={dish.name}
                image={{ uri: baseUrl + dish.image }}>
                <Text style={{ margin: 10 }}>
                    {dish.description}
                </Text>
                <Icon
                    raised
                    reverse
                    name={props.favorite ? 'heart' : 'heart-o'}
                    type='font-awesome'
                    color='#f50'
                    onPress={() => props.favorite ? console.log('Already favorite') : props.onFavorite()}
                    style={{ flex: 1 }}
                />
                <Icon
                    raised
                    reverse
                    name={'pencil'}
                    type='font-awesome'
                    color='#8a2be2'
                    onPress={() => props.onComment()}
                    style={{ flex: 1 }}
                />
            </Card>
        );
    }
    else {
        return (<View></View>);
    }
}

function RenderComments(props) {
    const comments = props.comments;
    const renderCommentItem = ({ item, index }) => {
        return (
            <View key={index} style={{ margin: 10 }}>
                <Text style={{ fontSize: 14 }}>{item.comment}</Text>
                <Text style={{ fontSize: 12 }}>{item.rating} Stars</Text>
                <Text style={{ fontSize: 12 }}>{'-- ' + item.author + ', ' + item.date}</Text>
            </View>
        );
    }

    return (
        <Card title="Comments">
            <FlatList data={comments} renderItem={renderCommentItem} keyExtractor={item => item.id.toString()} />
        </Card>
    );
}

class Dishdetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            rating: 3,
            author: '',
            comment: ''
        }

        this.ratingComplete = this.ratingComplete.bind(this);
    }

    markFavorite(dishId) {
        this.props.postFavorite(dishId);
    }

    handleEditComment() {
        this.toggleModal();
    }

    handleSubmitComment(dishId) {
        this.props.postComment(
            dishId,
            this.state.rating,
            this.state.author,
            this.state.comment
        );
    }

    ratingComplete(rating) {
        this.setState({ rating: rating })
    }

    toggleModal() {
        this.setState({ showModal: !this.state.showModal });
    }

    resetForm() {
        this.setState({
            rating: 3,
            author: '',
            comment: ''
        });
    }

    static navigationOptions = {
        title: 'Dish Details'
    };

    render() {
        const dishId = this.props.navigation.getParam('dishId', '');
        return (
            <ScrollView>
                <RenderDish dish={this.props.dishes.dishes[+dishId]}
                    favorite={this.props.favorites.some(el => el === dishId)}
                    onFavorite={() => this.markFavorite(dishId)}
                    onComment={() => this.handleEditComment()}
                />
                <RenderComments comments={this.props.comments.comments.filter((comment) => comment.dishId === dishId)} />
                <Modal animationType={'slide'}
                    transparent={false}
                    visible={this.state.showModal}
                    onRequestClose={() => { this.toggleModal(); this.resetForm() }}
                >
                    <View style={styles.modal}>
                        <Rating
                            type='star'
                            ratingCount={5}
                            imageSize={30}
                            showRating
                            onFinishRating={this.ratingComplete}
                        />
                        <Input
                            placeholder="Author"
                            leftIcon={{ type: 'font-awesome', name: 'user-o' }}
                            onChangeText={author => this.setState({ author: author })}
                        />
                        <Input
                            placeholder="Comment"
                            leftIcon={{ type: 'font-awesome', name: 'comment-o' }}
                            onChangeText={comment => this.setState({ comment: comment })}
                        />
                        <Button onPress={() => {
                            this.handleSubmitComment(dishId);
                            this.toggleModal();
                            this.resetForm();
                        }}
                            color='#8a2be2'
                            title='Submit'
                        />
                        <Button onPress={() => { this.toggleModal(); this.resetForm() }}
                            color='#512DA8'
                            title='Cancel'
                        />
                    </View>
                </Modal>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    formRow: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        flexDirection: 'row',
        margin: 20
    },
    formLabel: {
        fontSize: 18,
        flex: 2
    },
    formItem: {
        flex: 1
    },
    modal: {
        justifyContent: 'center',
        margin: 20
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        backgroundColor: '#512DA8',
        textAlign: 'center',
        color: 'white',
        marginBottom: 20
    },
    modalText: {
        fontSize: 18,
        margin: 10
    }
})

export default connect(mapStateToProps, mapDispatchToProps)(Dishdetail);