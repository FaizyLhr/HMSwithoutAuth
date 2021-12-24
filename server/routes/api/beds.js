let router = require("express").Router();
let { OkResponse, BadRequestResponse } = require("express-http-response");

const { isBedFree } = require("../auth");

const BedModel = require("../../models/Bed");

router.param("bedSlug", (req, res, next, slug) => {
	BedModel.findOne(
		{
			slug,
		},
		(err, bed) => {
			if (!err && bed !== null) {
				// console.log(bed);
				req.bed = bed;
				return next();
			}
			return next(new BadRequestResponse("Bed not found!", 423));
		}
	);
});

router.get("/", function (req, res, next) {
	next(
		new OkResponse({
			message: `Products Api's are working`,
		})
	);
	return;
});

router.put("/free/:bedSlug", isBedFree, async (req, res, next) => {
	req.bed.isFree = true;
	req.bed.save((err, result) => {
		if (err) {
			// console.log(err);
			return next(new BadRequestResponse(err));
		} else {
			// console.log(result);
			return next(
				new OkResponse({
					bed: req.bed,
				})
			);
		}
	});
});

module.exports = router;
