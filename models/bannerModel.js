var mongoose = require("mongoose");

const banner = mongoose.Schema({
    banner: { type: String, required: [true, "please enter banner"] },
    logo: { type: String, required: [true, "please enter logo"] },
    title: { type: String, required: [true, "please enter title"] },
    description: { type: String, required: [true, "please enter description"] },
    
});

var Banner = mongoose.model("banner", banner);
module.exports = Banner;